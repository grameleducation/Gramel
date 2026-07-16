import { NextResponse } from "next/server";
import { auth } from "@/utils/better-auth/auth";
import { UserActions, UserRoles } from "@/lib/permissions/role";
import pool from "@/utils/db";
import tryCatch from "@/utils/tryCatch";
import { isUserRole } from "@/utils/isUserRoles";
import { hasPermission } from "@/lib/permissions/utils";

// This endpoint gets all staffs and admin
export async function GET(request: Request) {
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

  const [result, queryError] = await tryCatch(() =>
    pool.query<{
      id: string;
      first_name: string | null;
      middle_name: string | null;
      last_name: string | null;
      role: UserRoles;
    }>(
      `SELECT id, first_name, middle_name, last_name, role FROM public.users WHERE role IN ($1, $2)`,
      [UserRoles.admin, UserRoles.staff],
    ),
  );

  if (queryError) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch staff list" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: result.rows,
  });
}
