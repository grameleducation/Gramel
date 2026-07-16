import StudentProfileForm from "./components/StudentProfileForm";
import { redirect, RedirectType } from "next/navigation";
import ProfileFetchError from "../../../components/ProfileFetchError";
import { z } from "zod";
import { profileSchema, profileReadSchema } from "@/lib/zodSchemas";
import WelcomeModal from "./components/WelcomeModal";
import { UserRoles } from "@/lib/permissions/role";
import tryCatch from "@/utils/tryCatch";
import { auth } from "@/utils/better-auth/auth";
import pool from "@/utils/db";
import { headers } from "next/headers";

export type Profile = z.infer<typeof profileSchema>;

// Fetch personal info from users table
async function fetchProfileData(user_id: string) {
  const queryResult = await pool.query<
    Profile & { profile_picture_url: string | null }
  >(
    `SELECT first_name, last_name, middle_name, email, date_of_birth, passport_no, passport_expiry_date, gender, marital_status, address, phone, profile_picture_url, highest_education, highest_edu_country, highest_edu_grading_scale, highest_edu_grade_average, next_of_kin, higher_institutions, secondary_schools, other_education FROM public.users WHERE id = $1 AND role = 'student'`,
    [user_id],
  );

  return queryResult.rows[0];
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; new_user?: string }>;
}) {
  const { error: errorParam, new_user } = await searchParams;
  if (errorParam === "invalid_token" || errorParam === "token_expired") {
    redirect(
      `/login?error=${encodeURIComponent("Invalid or expired confirmation link. Try logging-in again to get a new one or create an account if you don't have one already.")}`,
      RedirectType.replace,
    );
  }

  const [result, sessionError] = await tryCatch(async () =>
    auth.api.getSession({ headers: await headers() }),
  );
  if (sessionError) redirect("/");
  if (!result?.user) redirect("/login");

  const user = result.user;
  // Ensure the user is a student
  if (user.role !== UserRoles.student) redirect("/");

  const [userProfile, error] = await tryCatch(() => fetchProfileData(user.id));

  // If there was an error getting user profile
  if (error || !userProfile) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <ProfileFetchError />
      </main>
    );
  }

  // Validate with zod (use read schema that allows empty values in case of new users)
  const validation = profileReadSchema.safeParse(userProfile);
  if (!validation.success) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <ProfileFetchError errorMsg="Profile data is invalid. Please try again." />
      </main>
    );
  }

  return (
    <>
      <section>
        <StudentProfileForm profile={validation.data} />
      </section>
      <WelcomeModal new_user={new_user === "true"} />
    </>
  );
}
