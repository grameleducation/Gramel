import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/better-auth/auth";
import { UserActions, UserRoles } from "@/lib/permissions/role";
import pool from "@/utils/db";
import z from "zod";
import tryCatch from "@/utils/tryCatch";
import { searchFieldSchema } from "@/lib/zodSchemas";
import { isUserRole } from "@/utils/isUserRoles";
import { hasPermission } from "@/lib/permissions/utils";

const baseQuerySchema = z.object({
  page: z.coerce.number().int().min(1),
  studentsPerPage: z.coerce.number().int().min(1),
  ascending: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  searchField: searchFieldSchema.nullish(),
  searchQuery: z.string().nullish(),
  staffId: z.string().trim().min(1),
});

const studentsManagementSchema = baseQuerySchema.extend({
  source: z.literal("students-management"),
  staffRole: z.nativeEnum(UserRoles),
  adminStudentsFilter: z.enum(["all", "my", "unassigned"]),
});

const staffManagementSchema = baseQuerySchema.extend({
  source: z.literal("staff-management"),
});

// Endpoint for students listing in staff-management and students-management views.
export async function GET(request: NextRequest) {
  const userRole = (session.user as any).role || "student";
  const [session, sessionError] = await tryCatch(async () =>
    auth.api.getSession({ headers: request.headers }),
  );

  if (sessionError || !session?.user) {
    return NextResponse.json(
      {
        success: false,
        error: "You must be logged in to access this resource",
      },
  const userRole = (session.user as any).role || "student";
      { status: 401 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const source = searchParams.get("source");
  const commonQuery = {
    page: searchParams.get("page") ?? "1",
    studentsPerPage: searchParams.get("studentsPerPage") ?? "20",
    ascending: searchParams.get("ascending"),
    searchField: searchParams.get("searchField"),
    searchQuery: searchParams.get("searchQuery"),
    source,
    staffId: searchParams.get("staffId"),
    staffRole: searchParams.get("staffRole"),
    adminStudentsFilter: searchParams.get("adminStudentsFilter") ?? "all",
  };

  const parsed = z
    .discriminatedUnion("source", [
      studentsManagementSchema,
      staffManagementSchema,
    ])
    .safeParse(commonQuery);

  if (
    !isUserRole(userRole) ||
    (source === "staff-management"
      ? !hasPermission(
          userRole,
          UserActions.view_admin_staff_management,
        )
      : !hasPermission(
          userRole,
          UserActions.view_admin_student_management,
        ))
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "You are not authorized to access this resource",
      },
      { status: 403 },
    );
  }

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid query parameters" },
      { status: 400 },
    );
  }

  const {
    page,
    studentsPerPage,
    ascending,
    searchField,
    searchQuery,
    staffId,
  } = parsed.data;

  const from = (page - 1) * studentsPerPage;

  const whereConditions: string[] = ["role = 'student'"];
  const queryParams: (string | number)[] = [];
  let paramIndex = 1;

  if (parsed.data.source === "staff-management") {
    whereConditions.push(`assigned_staff_id = $${paramIndex}`);
    queryParams.push(staffId);
    paramIndex++;
  } else {
    const { staffRole, adminStudentsFilter } = parsed.data;

    if (staffRole !== UserRoles.admin) {
      whereConditions.push(`assigned_staff_id = $${paramIndex}`);
      queryParams.push(staffId);
      paramIndex++;
    } else if (adminStudentsFilter === "my") {
      whereConditions.push(`assigned_staff_id = $${paramIndex}`);
      queryParams.push(staffId);
      paramIndex++;
    } else if (adminStudentsFilter === "unassigned") {
      whereConditions.push("assigned_staff_id IS NULL");
    }
  }

  if (searchField && searchQuery) {
    if (searchField === "id") {
      whereConditions.push(`id = $${paramIndex}`);
      queryParams.push(searchQuery);
      paramIndex++;
    } else {
      whereConditions.push(`${searchField} ILIKE $${paramIndex}`);
      queryParams.push(`%${searchQuery}%`);
      paramIndex++;
    }
  }

  const whereClause = whereConditions.join(" AND ");
  const query = `
    SELECT id, first_name, middle_name, last_name, email, phone, COUNT(*) OVER() as total_count
    FROM public.users WHERE ${whereClause}
    ORDER BY created_at ${ascending ? "ASC" : "DESC"}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  queryParams.push(studentsPerPage, from);

  const [result, queryError] = await tryCatch(() =>
    pool.query<{
      id: string;
      first_name: string | null;
      middle_name: string | null;
      last_name: string | null;
      email: string;
      phone: string | null;
      total_count: string;
    }>(query, queryParams),
  );

  if (queryError) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch students list" },
      { status: 500 },
    );
  }

  const count =
    result.rows.length > 0 ? parseInt(result.rows[0].total_count, 10) : 0;

  return NextResponse.json({
    success: true,
    data: { students: result.rows, count },
  });
}
