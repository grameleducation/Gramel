import "server-only";

import { z } from "zod";

const envSchema = z.object({
  // Database (optional for assist subdomain which only serves static content)
  DATABASE_URL: z.string().trim().min(1).optional(),
  // hcaptcha (optional - assist doesn't have contact forms)
  HCAPTCHA_SECRET_KEY: z.string().trim().min(1).optional(),
  // paystack (optional - assist has no payments)
  PAYSTACK_SECRET_KEY: z.string().trim().min(1).optional(),
  // cloudinary (optional - assist uses existing image URLs)
  CLOUDINARY_CLOUD_NAME: z.string().trim().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().trim().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().trim().min(1).optional(),
  // smtp (optional - assist has no email sending)
  SMTP_HOST: z.string().trim().min(1).optional(),
  SMTP_PORT: z.coerce.number().min(1).optional(),
  SMTP_USER: z.string().trim().min(1).optional(),
  SMTP_PASSWORD: z.string().trim().min(1).optional(),

  // oauth (optional - assist has no auth)
  GOOGLE_CLIENT_ID: z.string().trim().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().trim().min(1).optional(),

  // better-auth (optional - assist has no auth)
  BETTER_AUTH_SECRET: z.string().trim().min(1).optional(),
});

function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => err.path.join("."))
        .join(", ");
      throw new Error(`Invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
}

const server_env = validateEnv();

export default server_env;
