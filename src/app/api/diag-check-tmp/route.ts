import { v2 as cloudinary } from "cloudinary";
import server_env from "@/utils/env.server";
import transporter from "@/utils/emailTransporter";

export async function GET() {
  cloudinary.config({
    cloud_name: server_env.CLOUDINARY_CLOUD_NAME,
    api_key: server_env.CLOUDINARY_API_KEY,
    api_secret: server_env.CLOUDINARY_API_SECRET,
  });

  const results: Record<string, string> = {};

  try {
    await cloudinary.api.ping();
    results.cloudinary = "OK";
  } catch (err) {
    results.cloudinary = `FAIL: ${
      err && typeof err === "object" && "error" in err
        ? (err as { error?: { message?: string } }).error?.message
        : String(err)
    }`;
  }

  try {
    await transporter.verify();
    results.smtp = "OK";
  } catch (err) {
    results.smtp = `FAIL: ${err instanceof Error ? err.message : String(err)}`;
  }

  return Response.json(results);
}
