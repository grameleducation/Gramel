import { z } from "zod";

const envSchema = z.object({
  // base url
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  // hcaptcha
  NEXT_PUBLIC_HCAPTCHA_SITE_KEY: z.string().trim().min(1),
  // applyboard
  NEXT_PUBLIC_APPLYBOARD_PARTNER_ID: z.string().trim().min(1),
});

function validateEnv() {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NEXT_PUBLIC_HCAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY,
      NEXT_PUBLIC_APPLYBOARD_PARTNER_ID:
        process.env.NEXT_PUBLIC_APPLYBOARD_PARTNER_ID,
    });
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

const client_env = validateEnv();

export default client_env;
