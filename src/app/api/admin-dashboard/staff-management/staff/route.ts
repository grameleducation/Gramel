import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/better-auth/auth";
import { UserActions } from "@/lib/permissions/role";
import pool from "@/utils/db";
import z from "zod";
import tryCatch from "@/utils/tryCatch";
import { searchFieldSchema } from "@/lib/zodSchemas";
import { isUserRole } from "@/utils/isUserRoles";
import { hasPermission } from "@/lib/permissions/utils";

const querySchema = z.object({
  page: z.coerce.number().int().min(1),
  staffPerPage: z.coerce.number().int().min(1),
  ascending: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  searchField: searchFieldSchema.nullish(),
  searchQuery: z.string().nullish(),
});

// This endpoint gets list of staffs. Also filter staffs with provided parameters
export async function GET(request: NextRequest) {
  const [session, sessionError] = await tryCatch(async () =>
    auth.api.getSession({ headers: request.headers }),
  );

  if (sessionError || !session?.user) {
    return NextResponse.json(
      {
        success: false,
        error: "You must be logged in to access this resource",
      },
      { status: 401 },
    );
  }

  const userRole = (session.user as any).role || "student";

  if (
    !isUserRole(userRole) ||
    !hasPermission(userRole, UserActions.view_admin_staff_management)
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "You are not authorized to access this resource",
      },
      { status: 403 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const parsed = querySchema.safeParse({
    page: searchParams.get("page") ?? "1",
    staffPerPage: searchParams.get("staffPerPage") ?? "20",
    ascending: searchParams.get("ascending"),
    searchField: searchParams.get("searchField"),
    searchQuery: searchParams.get("searchQuery"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid query parameters" },
      { status: 400 },
    );
  }

  const { page, staffPerPage, ascending, searchField, searchQuery } =
    parsed.data;
  const from = (page - 1) * staffPerPage;

  const whereConditions: string[] = ["role = 'staff'"];
  const queryParams: (string | number)[] = [];
  let paramIndex = 1;

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

  queryParams.push(staffPerPage, from);

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
      { success: false, error: "Failed to fetch staff list" },
      { status: 500 },
    );
  }

  const count =
    result.rows.length > 0 ? parseInt(result.rows[0].total_count, 10) : 0;

  return NextResponse.json({
    success: true,
    data: { staff: result.rows, count },
  });
}
