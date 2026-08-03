import { v2 as cloudinary } from "cloudinary";
import server_env from "@/utils/env.server";
import pool from "@/utils/db";

export async function GET() {
  const results: Record<string, string> = {};

  cloudinary.config({
    cloud_name: server_env.CLOUDINARY_CLOUD_NAME,
    api_key: server_env.CLOUDINARY_API_KEY,
    api_secret: server_env.CLOUDINARY_API_SECRET,
  });

  // 1. Real signed raw upload through the exact preset the form uses
  try {
    const paramsToSign = {
      timestamp: Math.round(Date.now() / 1000),
      display_name: "diag-test-cv",
      allowed_formats: "pdf,doc,docx",
      invalidate: true,
      upload_preset: "gramel_job_application_cvs",
    };
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      server_env.CLOUDINARY_API_SECRET!,
    );

    const dummyPdf = Buffer.from(
      "%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF",
    );
    const form = new FormData();
    form.append(
      "file",
      new Blob([dummyPdf], { type: "application/pdf" }),
      "diag-test.pdf",
    );
    form.append("timestamp", `${paramsToSign.timestamp}`);
    form.append("api_key", server_env.CLOUDINARY_API_KEY!);
    form.append("signature", signature);
    form.append("upload_preset", paramsToSign.upload_preset);
    form.append("display_name", paramsToSign.display_name);
    form.append("allowed_formats", paramsToSign.allowed_formats);
    form.append("invalidate", "true");

    const uploadUrl = `https://api.cloudinary.com/v1_1/${server_env.CLOUDINARY_CLOUD_NAME}/raw/upload`;
    const res = await fetch(uploadUrl, { method: "POST", body: form });
    const data = await res.json();

    if (!res.ok || !data.secure_url) {
      results.cloudinaryUpload = `FAIL (status ${res.status}): ${JSON.stringify(data)}`;
    } else {
      results.cloudinaryUpload = `OK: ${data.secure_url}`;
      // cleanup
      await cloudinary.uploader
        .destroy(data.public_id, { resource_type: "raw" })
        .catch(() => {});
    }
  } catch (err) {
    results.cloudinaryUpload = `THROWN: ${err instanceof Error ? err.message : String(err)}`;
  }

  // 2. Real DB insert + rollback through the exact table the form uses
  try {
    const insertRes = await pool.query(
      `INSERT INTO public.job_applications (role_slug, role_title, full_name, email, phone, cv_url, message)
       VALUES ('diag-test','Diag Test','Diag Test','diag@test.com','0000000000','https://example.com/diag.pdf',NULL)
       RETURNING id`,
    );
    const id = insertRes.rows[0].id;
    await pool.query(`DELETE FROM public.job_applications WHERE id = $1`, [
      id,
    ]);
    results.dbInsert = "OK";
  } catch (err) {
    results.dbInsert = `FAIL: ${err instanceof Error ? err.message : String(err)}`;
  }

  return Response.json(results);
}
