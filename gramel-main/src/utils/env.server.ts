import "server-only";

import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().trim().min(1),
  // hcaptcha
  HCAPTCHA_SECRET_KEY: z.string().trim().min(1),
  // paystack
  PAYSTACK_SECRET_KEY: z.string().trim().min(1),
  // cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().trim().min(1),
  CLOUDINARY_API_KEY: z.string().trim().min(1),
  CLOUDINARY_API_SECRET: z.string().trim().min(1),
  // smtp
  SMTP_HOST: z.string().trim().min(1),
  SMTP_PORT: z.coerce.number().min(1),
  SMTP_USER: z.string().trim().min(1),
  SMTP_PASSWORD: z.string().trim().min(1),

  // oauth
  GOOGLE_CLIENT_ID: z.string().trim().min(1),
  GOOGLE_CLIENT_SECRET: z.string().trim().min(1),

  // better-auth
  BETTER_AUTH_SECRET: z.string().trim().min(1),
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
