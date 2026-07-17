import { redirect } from "next/navigation";
import { UserActions, UserRoles } from "@/lib/permissions/role";
import { hasPermission } from "@/lib/permissions/utils";
import StudentsManagementView from "./components/StudentManagementView";
import tryCatch from "@/utils/tryCatch";
import { auth } from "@/utils/better-auth/auth";
import { headers } from "next/headers";
import { isUserRole } from "@/utils/isUserRoles";

export default async function StudentsManagementPage() {
  const [result, sessionError] = await tryCatch(async () =>
    auth.api.getSession({ headers: await headers() }),
  );
  if (sessionError) redirect("/");
  if (!result?.user) redirect("/login");

  const userRole = (result.user as any).role || "student";

  // Ensure the user is an admin or staff
  if (
    !isUserRole(userRole) ||
    !hasPermission(userRole, UserActions.view_admin_student_management)
  ) {
    redirect("/");
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-light-gray pt-6 pb-8 sm:pt-12">
      <StudentsManagementView
        user={{
          id: result.user.id,
          user_role: userRole as UserRoles,
        }}
      />
    </main>
  );
}
