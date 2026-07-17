"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  forgotPasswordSchema,
  loginSchema,
  signUpSchema,
  updatePasswordSchema,
} from "@/lib/zodSchemas";
import { ClientUser } from "@/lib/types";
import { auth } from "@/utils/better-auth/auth";
import { isUserRole } from "@/utils/isUserRoles";
import client_env from "@/utils/env.client";
import { isValidHCaptcha } from "@/utils/isValidCaptcha";

// ============= EMAIL/PASSWORD SIGNUP ================
export async function signupAction(
  formData: z.infer<typeof signUpSchema>,
  captchaToken: string,
): Promise<{ success: boolean; message: string }> {
  // Validate user provided data
  const validatedData = signUpSchema.safeParse(formData);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid data provided",
    };
  }
  // Verify hCaptcha token
  const isValidCaptcha = await isValidHCaptcha(captchaToken);
  if (!isValidCaptcha) {
    return {
      success: false,
      message: "Captcha verification failed",
    };
  }

  const { email, password, first_name, last_name } = validatedData.data;

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: `${first_name} ${last_name}`,
        first_name,
        last_name,
        callbackURL: "/student-profile?new_user=true",
      },
    });

    revalidatePath("/");
    return {
      success: true,
      message:
        "Signup successful. Check your email inbox to verify your account.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred creating your account. Please try again!",
    };
  }
}

// ================= EMAIL/PASSWORD LOGIN ========================
// Type definition for sign-in result
type LoginResult =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      user: ClientUser;
    };

export async function loginAction(
  formData: z.infer<typeof loginSchema>,
  captchaToken: string,
): Promise<LoginResult> {
  // Validate input data
  const { success, data } = loginSchema.safeParse(formData);
  if (!success) return { success: false, message: "Invalid data provided" };

  // Verify hCaptcha token
  const isValidCaptcha = await isValidHCaptcha(captchaToken);
  if (!isValidCaptcha) {
    return {
      success: false,
      message: "Captcha verification failed",
    };
  }

  try {
    const result = await auth.api.signInEmail({
      body: data,
    });

    revalidatePath("/");
    if (!isUserRole(userRole)) {
      return {
        success: false,
        message: "Invalid user role. Please contact support.",
      };
    }

    return {
      success: true,
      user: { ...result.user, role: userRole },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message:
          "statusCode" in error && error.statusCode === 403
            ? "Email not verified. Check your inbox for a verification email."
            : error.message ||
              "An error occurred logging you in. Please try again.",
      };
    }
    return {
      success: false,
      message: "An error occurred logging you in. Please try again.",
    };
  }
}

// ================= FORGOT PASSWORD ========================
export async function forgotPasswordAction(
  email: string,
  captchaToken: string,
): Promise<{ success: boolean; message: string }> {
  // Data validation
  const { success: isValidEmail } = forgotPasswordSchema.safeParse({ email });
  if (!isValidEmail)
    return { success: false, message: "Invalid email provided" };

  // Verify hCaptcha token
  const isValidCaptcha = await isValidHCaptcha(captchaToken);
  if (!isValidCaptcha) {
    return {
      success: false,
      message: "Captcha verification failed",
    };
  }

  try {
    // Use the auth client's requestPasswordReset method
    const result = await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${client_env.NEXT_PUBLIC_BASE_URL}/update-password`,
      },
    });

    return {
      success: true,
      message: result.message || "Password reset email sent successfully!",
    };
  } catch {
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    };
  }
}

// ================= RESET PASSWORD ========================
export async function resetPasswordAction(
  formData: z.infer<typeof updatePasswordSchema>,
  resetToken: string,
) {
  try {
    const { success: isValidPassword, data } =
      updatePasswordSchema.safeParse(formData);
    if (!isValidPassword) {
      return {
        success: false,
        message: "Invalid password provided",
      };
    }

    if (!resetToken.trim()) {
      return {
        success: false,
        message:
          "Invalid or expired link. Please make a new password reset request.",
      };
    }

    const result = await auth.api.resetPassword({
      body: {
        newPassword: data.password,
        token: resetToken,
      },
    });
    if (!result.status) {
      return {
        success: false,
        message: "Password reset failed. Please try again later.",
      };
    }

    return {
      success: true,
      message: "Password reset successfully!",
    };
  } catch {
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    };
  }
}
