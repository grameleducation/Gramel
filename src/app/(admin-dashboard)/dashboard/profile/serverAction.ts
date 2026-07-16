"use server";

import {
  adminProfileSchema,
  type AdminProfileFormData,
} from "@/lib/zodSchemas";
import { headers } from "next/headers";
import { auth } from "@/utils/better-auth/auth";
import pool from "@/utils/db";
import tryCatch from "@/utils/tryCatch";

type ServerActionResponse =
  | { success: true; message: string; data: AdminProfileFormData }
  | { success: false; message: string };

export async function updateAdminProfile(
  formData: AdminProfileFormData,
): Promise<ServerActionResponse> {
  try {
    const validationResult = adminProfileSchema.safeParse(formData);

    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid data provided",
      };
    }

    const [session, sessionError] = await tryCatch(async () =>
      auth.api.getSession({ headers: await headers() }),
    );
    if (sessionError || !session?.user) {
      return {
        success: false,
        message: "You must be logged in to update your profile",
      };
    }

    const { first_name, middle_name, last_name, email } = validationResult.data;
    void email;
    const fullName = [first_name, middle_name, last_name]
      .filter(Boolean)
      .join(" ");

    const [updateResult, updateError] = await tryCatch(async () =>
      pool.query<AdminProfileFormData>(
        `UPDATE public.users
         SET first_name = $1, middle_name = $2, last_name = $3, name = $4
         WHERE id = $5 AND role IN ('admin', 'staff')
         RETURNING first_name, middle_name, last_name, email`,
        [first_name, middle_name || null, last_name, fullName, session.user.id],
      ),
    );

    if (updateError || updateResult.rows.length === 0) {
      return {
        success: false,
        message: "Failed to update profile. Please try again.",
      };
    }

    return {
      success: true,
      message: "Profile updated successfully!",
      data: updateResult.rows[0],
    };
  } catch {
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
