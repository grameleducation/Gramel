"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { updatePasswordSchema } from "@/lib/zodSchemas";
import { NewFormInput } from "./FormInput";
import SubmitButton from "./SubmitButton";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { resetPasswordAction } from "@/app/(general-view)/(auth)/serverActions";

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export default function UpdatePasswordForm() {
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");
  const resetError = searchParams.get("error");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  // Handle reset password error
  useEffect(() => {
    if (resetError) {
      toast.error(
        "Invalid or expired link. Provide your email to make a new password reset request.",
      );
      router.push("/forgot-password");
    }
  }, [resetError]);

  // Countdown and redirect after password update
  useEffect(() => {
    if (!passwordUpdated) return;

    if (redirectCountdown < 1) {
      router.push("/login");
      return;
    }

    const interval = setInterval(() => {
      setRedirectCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [passwordUpdated, redirectCountdown]);

  const onSubmit = async (data: UpdatePasswordFormData) => {
    try {
      if (!resetToken)
        return void toast.error("Invalid reset token. Please try again.");

      const response = await resetPasswordAction(data, resetToken);

      if (!response.success) {
        return void toast.error(
          response.message || "Failed to update password. Please try again.",
        );
      }

      // Success
      setPasswordUpdated(true);
      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  // Show the form
  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl shadow-primary/10 md:p-12">
      {/* Show success message after password is updated */}
      {passwordUpdated ? (
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-primary">
              Password Updated Successfully!
            </h2>
            <p className="text-lg text-[#1E1E1E]">
              Your password has been changed successfully.
            </p>
          </div>

          <div className="rounded-xl bg-[#EFEFEF] p-6">
            <p className="text-[#1E1E1E]">
              You can now use your new password to log in to your account.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
              <p className="font-semibold">
                Redirecting to login page in {redirectCountdown} second
                {redirectCountdown !== 1 ? "s" : ""}...
              </p>
            </div>
            <Link
              href="/login"
              className="block w-full rounded-[0.625rem] bg-primary p-4 font-semibold text-white transition-colors duration-200 hover:bg-[#62A9DC]"
              prefetch={false}
            >
              Go to Login Page
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Icon Header */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <ShieldCheck className="h-12 w-12 text-primary" />
            </div>
          </div>

          {/* Title Section */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold text-primary lg:text-4xl">
              Create New Password
            </h1>
            <p className="text-[#1E1E1E]">
              Almost there! Choose a strong password to secure your account.
              Make sure it's at least 8 characters long and something you'll
              remember.
            </p>
          </div>

          <hr className="mb-8 bg-[#7F7F7F]" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <NewFormInput
                name="password"
                type="password"
                label="New Password"
                placeholder="Enter your new password"
                autoComplete="new-password"
                error={errors.password}
                register={register}
              />

              <div className="space-y-2.5">
                <NewFormInput
                  name="confirm_password"
                  type="password"
                  label="Confirm New Password"
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                  error={errors.confirm_password}
                  register={register}
                />
                {!errors.password && !errors.confirm_password && (
                  <small className="text-xs text-[#626060]">
                    Make sure both passwords match
                  </small>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <SubmitButton
                isPending={isSubmitting}
                pendingText="Updating Password..."
                defaultText="Update Password"
              />
            </div>

            <hr className="my-4 bg-[#7F7F7F]" />

            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-center text-xs text-[#1E1E1E]">
                <strong>Security Tip:</strong> Use a strong password with a mix
                of letters, numbers, and special characters for better security.
              </p>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
