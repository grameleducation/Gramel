import { redirect } from "next/navigation";
import { UserActions } from "@/lib/permissions/role";
import { hasPermission } from "@/lib/permissions/utils";
import StaffManagementView from "./StaffManagementView";
import tryCatch from "@/utils/tryCatch";
import { auth } from "@/utils/better-auth/auth";
import { headers } from "next/headers";
import { isUserRole } from "@/utils/isUserRoles";

export default async function StaffManagementPage() {
  const [result, error] = await tryCatch(async () =>
    auth.api.getSession({ headers: await headers() }),
  );
  if (error) redirect("/");
  if (!result?.user) redirect("/login");

  const userRole = (result.user as any).role || "student";

  // Ensure the user is an admin
  if (
    !isUserRole(userRole) ||
    !hasPermission(userRole, UserActions.view_admin_staff_management)
  ) {
    redirect("/");
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-light-gray pt-6 pb-8 sm:pt-12">
      <h1 className="mb-10 text-center text-2xl font-bold text-primary">
        ALL STAFF
      </h1>

      <StaffManagementView />
    </main>
  );
}
