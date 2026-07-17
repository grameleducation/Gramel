import { redirect } from "next/navigation";
import { UserActions } from "@/lib/permissions/role";
import { hasPermission } from "@/lib/permissions/utils";
import DashboardView from "./DashboardView";
import { auth } from "@/utils/better-auth/auth";
import tryCatch from "@/utils/tryCatch";
import { headers } from "next/headers";
import { isUserRole } from "@/utils/isUserRoles";

export type ServiceCode =
  | "IADM1"
  | "IADM2"
  | "DOCV"
  | "SCHL"
  | "VISA"
  | "IELTS"
  | "TOEFL"
  | "GRE"
  | "DTE"
  | "PTE"
  | "LOAN"
  | "ADVS";
export type AdminDashboardResponse = {
  student_stats: { students_with_applications: number };
  gender_distribution: { gender: "Male" | "Female" | "N/A"; count: number }[];
  age_distribution: {
    age_range: "0-19" | "20-39" | "40-59" | "60-79" | "80-99" | "100+" | "N/A";
    count: number;
  }[];
  applicants_by_service: { service_code: ServiceCode; count: number }[];
  revenue_by_service: { service_code: ServiceCode; total_revenue: number }[];
};

export default async function Dashboard() {
  const [result, error] = await tryCatch(async () =>
    auth.api.getSession({ headers: await headers() }),
  );
  if (error) redirect("/");
  if (!result?.user) redirect("/login");

  // Ensure the user is an admin or staff
  const userRole = (result.user as any).role || "student";
  if (
    !isUserRole(userRole) ||
    !hasPermission(userRole, UserActions.view_admin_dashboard)
  ) {
    redirect("/");
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-light-gray pt-12 pb-8">
      <DashboardView />
    </main>
  );
}
