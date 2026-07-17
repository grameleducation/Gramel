import { UserActions, UserRoles } from "@/lib/permissions/role";
import { hasPermission } from "@/lib/permissions/utils";
import { redirect } from "next/navigation";
import SingleStaffView from "./components/SingleStaffView";
import tryCatch from "@/utils/tryCatch";
import { headers } from "next/headers";
import { auth } from "@/utils/better-auth/auth";
import pool from "@/utils/db";
import { Database } from "@/utils/supabase/types";
import { isUserRole } from "@/utils/isUserRoles";

async function fetchStaffData(staff_id: string) {
  const queryResult = await pool.query<
    Pick<
      Database["public"]["Tables"]["users"]["Row"],
      "id" | "email" | "role" | "first_name" | "middle_name" | "last_name"
    >
  >(
    `SELECT id, email, role, first_name, middle_name, last_name FROM public.users WHERE id = $1`,
    [staff_id],
  );

  return queryResult.rows[0];
}

export default async function SingleStaffPage({
  params,
}: {
  params: Promise<{ staff_id: string }>;
}) {
  const { staff_id } = await params;
  if (!staff_id) redirect("/dashboard/staff-management");

  const [result, sessionError] = await tryCatch(async () =>
    auth.api.getSession({ headers: await headers() }),
  );
  if (sessionError) redirect("/");
  if (!result?.user) redirect("/login");

  const currentUserData = result.user as typeof result.user & { role: string };
  // Fetch staff data
  const [staffData, error] = await tryCatch(() => fetchStaffData(staff_id));
  if (error) redirect("/");

  if (!currentUserData || !staffData) redirect("/");

  // Check user permission
  if (
    !isUserRole(currentUserData.role) ||
    !hasPermission(
      currentUserData.role,
      UserActions.view_admin_staff_management,
    )
  ) {
    redirect("/");
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-light-gray px-6 pt-6 pb-8 md:px-8">
      {/* Staff name and ID */}
      <div className="mb-8">
        <h1 className="mb-2 text-center text-2xl font-bold text-primary">
          STAFF
        </h1>
        <h2 className="mb-2 text-center text-2xl font-bold text-primary-300 lg:text-left">
          {staffData.first_name} {staffData.middle_name} {staffData.last_name}
        </h2>
        <div className="flex flex-col gap-4 lg:flex-row">
          <p className="text-center text-gray-600 lg:text-left">
            <strong>Staff ID:</strong> {staff_id}
          </p>
          <p className="text-center text-gray-600 lg:text-left">
            <strong>Staff Email:</strong> {staffData.email}
          </p>
        </div>
      </div>

      <SingleStaffView
        user={{
          this_staff_id: staff_id,
          user_role: currentUserData.role as UserRoles,
        }}
      />
    </main>
  );
}
