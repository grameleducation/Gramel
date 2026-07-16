"use server";

import { profileSchema } from "@/lib/zodSchemas";
import { type Profile } from "./page";
import server_env from "@/utils/env.server";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";
import tryCatch from "@/utils/tryCatch";
import { auth } from "@/utils/better-auth/auth";
import { headers } from "next/headers";
import pool from "@/utils/db";
import { isPlainObject } from "lodash";

type ServerActionResponse =
  | { success: true; message: string; data: Profile }
  | { success: false; message: string };

export async function updateStudentProfile(
  formData: Profile,
): Promise<ServerActionResponse> {
  try {
    // Validate the form data using the same schema as frontend
    const validationResult = profileSchema.safeParse(formData);

    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid data provided",
      };
    }

    // Check user authentication
    const [session, sessionError] = await tryCatch(async () =>
      auth.api.getSession({ headers: await headers() }),
    );
    if (sessionError || !session?.user) {
      return {
        success: false,
        message: "You must be logged in to update your profile",
      };
    }

    // Prepare data for update (exclude email as it's readonly)
    const { email, ...updateData } = validationResult.data;
    void email; // Mark as intentionally unused

    // Update the profile in db
    const fields = Object.keys(updateData) as (keyof typeof updateData)[];
    const values = fields.map((key) => {
      const value = updateData[key];
      // Convert to JSON strings so pg don't serialize them incorrectly
      return Array.isArray(value) || isPlainObject(value)
        ? JSON.stringify(value)
        : value;
    });
    const fullName = [
      updateData.first_name,
      updateData.middle_name,
      updateData.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    values.push(fullName);
    const fullNamePosition = values.length;

    values.push(session.user.id); // Add user id to the end of values array
    const idPosition = values.length;
    const [updateResult, updateError] = await tryCatch(async () =>
      pool.query<Profile>(
        `UPDATE public.users
         SET ${fields.map((key, i) => `${key} = $${i + 1}`).join(", ")}, name = $${fullNamePosition}
         WHERE id = $${idPosition} AND role = 'student'
         RETURNING *`,
        values,
      ),
    );

    if (updateError) {
      return {
        success: false,
        message: "Failed to update profile. Please try again.",
      };
    }

    // Return success with updated data
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

// Cloudinary config
cloudinary.config({
  cloud_name: server_env.CLOUDINARY_CLOUD_NAME,
  api_key: server_env.CLOUDINARY_API_KEY,
  api_secret: server_env.CLOUDINARY_API_SECRET,
  secure: process.env.NODE_ENV === "production",
});

type CloudinarySignatureSuccess = {
  success: true;
  signature: string;
  timestamp: number;
  upload_preset: string;
  api_key: string;
  cloud_name: string;
  display_name: string;
  allowed_formats: string;
  invalidate: boolean;
  public_id?: string;
};

type CloudinarySignatureError = {
  success: false;
  error: string;
};

export async function getCloudinaryUploadSignature({
  assetType,
  fileSize,
  fileName,
}: {
  assetType: "profile_pictures" | "offline_proof_of_payments";
  fileSize: number;
  fileName: string;
}): Promise<CloudinarySignatureSuccess | CloudinarySignatureError> {
  try {
    const fileSizeValidation = z
      .number()
      .min(1)
      .max(1048576)
      .safeParse(fileSize);
    if (!fileSizeValidation.success) {
      return { success: false, error: "Invalid file size" };
    }

    // Check user authentication
    const [session, sessionError] = await tryCatch(async () =>
      auth.api.getSession({ headers: await headers() }),
    );
    if (sessionError || !session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const displayName = [
      session.user.first_name,
      session.user.middle_name,
      session.user.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    // Signature params
    // NOTE: asset folder has already been set in the upload preset
    //       preset asset_folder (gramel/users/profile_pictures) will be prepended to the public_id
    const paramsToSign = {
      timestamp: Math.round(Date.now() / 1000),
      display_name: `${displayName}_${fileName ? `${fileName.split(".").slice(0, -1).join(".")}_` : ""}${session.user.id}`,
      allowed_formats: "jpg,jpeg,png",
      invalidate: true,
      ...(assetType === "profile_pictures"
        ? {
            public_id: session.user.id,
            upload_preset: "gramel_profile_pictures",
          }
        : {
            upload_preset: "gramel_offline_proof_of_payments",
            return_delete_token: true,
          }),
    };

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      server_env.CLOUDINARY_API_SECRET,
    );

    // Return all necessary params for upload
    return {
      success: true,
      signature,
      ...("public_id" in paramsToSign && { public_id: paramsToSign.public_id }),
      timestamp: paramsToSign.timestamp,
      upload_preset: paramsToSign.upload_preset,
      api_key: server_env.CLOUDINARY_API_KEY,
      cloud_name: server_env.CLOUDINARY_CLOUD_NAME,
      display_name: paramsToSign.display_name,
      allowed_formats: paramsToSign.allowed_formats,
      invalidate: paramsToSign.invalidate,
    };
  } catch {
    return { success: false, error: "Failed to generate upload signature" };
  }
}

export async function updateProfilePicture(
  newUrl: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    z.string().url().parse(newUrl);
    // Check user authentication
    const [session, sessionError] = await tryCatch(async () =>
      auth.api.getSession({ headers: await headers() }),
    );
    if (sessionError || !session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Update new profile picture url (no need to delete old image)
    await pool.query<Profile>(
      `UPDATE public.users
       SET profile_picture_url = $1, image = $1
       WHERE id = $2`,
      [newUrl, session.user.id],
    );

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Error updating profile picture",
    };
  }
}
