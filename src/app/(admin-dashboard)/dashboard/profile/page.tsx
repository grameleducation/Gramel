import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/utils/better-auth/auth";
import pool from "@/utils/db";
import tryCatch from "@/utils/tryCatch";
import ProfileFetchError from "@/components/ProfileFetchError";
import { UserActions } from "@/lib/permissions/role";
import { hasPermission } from "@/lib/permissions/utils";
import { adminProfileReadSchema } from "@/lib/zodSchemas";
import { isUserRole } from "@/utils/isUserRoles";
import AdminProfileForm from "./components/AdminProfileForm";
import ProfilePicture from "./components/ProfilePicture";

type AdminProfile = z.infer<typeof adminProfileReadSchema>;

async function fetchProfileData(userId: string) {
  const queryResult = await pool.query<
    AdminProfile & { profile_picture_url: string | null }
  >(
    `SELECT first_name, middle_name, last_name, email, profile_picture_url
     FROM public.users
     WHERE id = $1 AND role IN ('admin', 'staff')`,
    [userId],
  );

  return queryResult.rows[0];
}

export default async function AdminProfilePage() {
  const [result, sessionError] = await tryCatch(async () =>
    auth.api.getSession({ headers: await headers() }),
  );
  if (sessionError) redirect("/");
  if (!result?.user) redirect("/login");

  const userRole = (result.user as any).role || "student";

  if (
    !isUserRole(userRole) ||
    !hasPermission(userRole, UserActions.view_admin_dashboard)
  ) {
    redirect("/");
  }

  const [userProfile, error] = await tryCatch(() =>
    fetchProfileData(result.user.id),
  );

  if (error || !userProfile) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <ProfileFetchError />
      </main>
    );
  }

  const validation = adminProfileReadSchema.safeParse(userProfile);
  if (!validation.success) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <ProfileFetchError errorMsg="Profile data is invalid. Please try again." />
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] px-6 py-8">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          <AdminProfileForm profile={validation.data} />
        </section>

        <aside className="flex flex-col gap-4 xl:order-last">
          <ProfilePicture />
        </aside>
      </div>
    </main>
  );
}
