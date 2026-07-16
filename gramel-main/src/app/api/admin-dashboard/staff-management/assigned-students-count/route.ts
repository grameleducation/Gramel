import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/better-auth/auth";
import { UserActions } from "@/lib/permissions/role";
import pool from "@/utils/db";
import z from "zod";
import tryCatch from "@/utils/tryCatch";
import { isUserRole } from "@/utils/isUserRoles";
import { hasPermission } from "@/lib/permissions/utils";

const querySchema = z.object({
  staffId: z.string().trim().min(1),
});

// This endpoint gets the total number of students assigned to a staff
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

  if (
    !isUserRole(session.user.role) ||
    !hasPermission(session.user.role, UserActions.view_admin_staff_management)
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "You are not authorized to access this resource",
      },
      { status: 403 },
    );
  }

  const parsed = querySchema.safeParse({
    staffId: request.nextUrl.searchParams.get("staffId"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid query parameters" },
      { status: 400 },
    );
  }

  const [result, queryError] = await tryCatch(() =>
    pool.query<{ count: string }>(
      `SELECT COUNT(*)::text as count FROM public.users WHERE assigned_staff_id = $1 AND role = 'student'`,
      [parsed.data.staffId],
    ),
  );

  if (queryError) {
    return NextResponse.json(
      { success: false, error: "Failed to get assigned students count" },
      { status: 500 },
    );
  }

  const count = result.rows.length > 0 ? parseInt(result.rows[0].count, 10) : 0;

  return NextResponse.json({
    success: true,
    data: count,
  });
}
