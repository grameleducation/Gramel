"use server";

import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";
import server_env from "@/utils/env.server";
import pool from "@/utils/db";
import tryCatch from "@/utils/tryCatch";
import transporter from "@/utils/emailTransporter";
import { jobApplicationSchema } from "@/lib/zodSchemas";
import { jobApplicationReceived } from "@/lib/emailTemplates";
import { isValidHCaptcha } from "@/utils/isValidCaptcha";
import { getCareerRole } from "../careersData";

cloudinary.config({
  cloud_name: server_env.CLOUDINARY_CLOUD_NAME!,
  api_key: server_env.CLOUDINARY_API_KEY!,
  api_secret: server_env.CLOUDINARY_API_SECRET!,
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
};

type CloudinarySignatureError = {
  success: false;
  error: string;
};

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function getCVUploadSignature({
  fileSize,
  fileName,
}: {
  fileSize: number;
  fileName: string;
}): Promise<CloudinarySignatureSuccess | CloudinarySignatureError> {
  const fileSizeValidation = z
    .number()
    .min(1)
    .max(MAX_CV_SIZE_BYTES)
    .safeParse(fileSize);
  if (!fileSizeValidation.success) {
    return { success: false, error: "Invalid file size" };
  }

  const paramsToSign = {
    timestamp: Math.round(Date.now() / 1000),
    display_name: fileName
      ? fileName.split(".").slice(0, -1).join(".")
      : "cv",
    allowed_formats: "pdf,doc,docx",
    invalidate: true,
    upload_preset: "gramel_job_application_cvs",
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    server_env.CLOUDINARY_API_SECRET!,
  );

  return {
    success: true,
    signature,
    timestamp: paramsToSign.timestamp,
    upload_preset: paramsToSign.upload_preset,
    api_key: server_env.CLOUDINARY_API_KEY!,
    cloud_name: server_env.CLOUDINARY_CLOUD_NAME!,
    display_name: paramsToSign.display_name,
    allowed_formats: paramsToSign.allowed_formats,
    invalidate: paramsToSign.invalidate,
  };
}

export async function submitJobApplicationAction(
  roleSlug: string,
  formData: z.infer<typeof jobApplicationSchema>,
  captchaToken: string,
): Promise<{ success: boolean; message: string }> {
  const role = getCareerRole(roleSlug);
  if (!role) {
    return { success: false, message: "This role is no longer available." };
  }

  const validatedData = jobApplicationSchema.safeParse(formData);
  if (!validatedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  const isValidCaptcha = await isValidHCaptcha(captchaToken);
  if (!isValidCaptcha) {
    return { success: false, message: "Captcha verification failed" };
  }

  const { fullName, email, phone, cvUrl, message } = validatedData.data;

  const [, insertError] = await tryCatch(() =>
    pool.query(
      `INSERT INTO public.job_applications (role_slug, role_title, full_name, email, phone, cv_url, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [roleSlug, role.title, fullName, email, phone, cvUrl, message ?? null],
    ),
  );

  if (insertError) {
    return {
      success: false,
      message: "An error occurred submitting your application. Please try again.",
    };
  }

  // Notify sales team. Best-effort: application is already saved even if this fails.
  const emailParams = {
    roleTitle: role.title,
    fullName,
    email,
    phone,
    cvUrl,
    message,
  };
  await transporter.sendMail({
    from: server_env.SMTP_USER!,
    to: 'sales@grameleducation.com',
    subject: jobApplicationReceived.subject,
    text: jobApplicationReceived.text(emailParams),
    html: jobApplicationReceived.html(emailParams),
  }).catch(() => {});

  return {
    success: true,
    message: "Application submitted successfully! We'll be in touch soon.",
  };
}
