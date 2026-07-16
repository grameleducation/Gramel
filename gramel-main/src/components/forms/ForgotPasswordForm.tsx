"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { forgotPasswordSchema } from "@/lib/zodSchemas";
import { NewFormInput } from "./FormInput";
import SubmitButton from "./SubmitButton";
import { CheckCircle2, Mail } from "lucide-react";
import { useCooldown } from "@/hooks/useCoolDown";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import useHCaptcha from "@/hooks/useHCaptcha";
import { forgotPasswordAction } from "@/app/(general-view)/(auth)/serverActions";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const { captchaToken, resetCaptcha, captchaProps } = useHCaptcha();
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { remainingTime, startCooldown } = useCooldown(
    "forgot_password_timestamp",
    2 * 60 * 1000, // 2 minutes
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Format remaining time as "Xmin Ys"
  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}min ${seconds}s`;
  };

  async function onSubmit(data: ForgotPasswordFormData) {
    if (!captchaToken) {
      toast.error("Please complete the captcha verification");
      return;
    }

    try {
      const result = await forgotPasswordAction(data.email, captchaToken);

      if (!result.success) return void toast.error(result.message);

      // On success, start cooldown and reset form
      startCooldown();
      setSubmittedEmail(data.email);
      setEmailSent(true);
      reset();
      resetCaptcha();
      toast.success(
        result.message || "Password reset email sent successfully!",
      );
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  // Show the form
  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl shadow-primary/10 md:p-12">
      {/* Show success message after email is sent */}
      {emailSent || remainingTime > 0 ? (
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary">
              Check Your Email
            </h2>
            {emailSent && (
              <>
                <p className="text-[#1E1E1E]">
                  We&apos;ve sent a password reset link to:
                </p>
                <p className="font-semibold text-primary">{submittedEmail}</p>
              </>
            )}
          </div>

          <div className="space-y-4 rounded-xl bg-[#EFEFEF] p-6 text-left text-sm text-[#1E1E1E]">
            <p className="font-semibold">What to do next:</p>
            <ol className="list-inside list-decimal space-y-2">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the password reset link in the email</li>
              <li>Create a new password for your account</li>
            </ol>
            <p className="text-xs text-[#626060]">
              The link will expire in 15 minutes for security reasons.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={() => {
                if (remainingTime > 0) return;
                setEmailSent(false);
                setSubmittedEmail("");
              }}
              disabled={remainingTime > 0}
              className={`w-full rounded-[0.625rem] border-2 border-primary bg-white p-4 font-semibold text-primary transition-colors duration-200 ${
                remainingTime > 0
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-primary/5"
              }`}
            >
              {remainingTime > 0
                ? `Want to resend? Wait ${formatTime(remainingTime)}`
                : "Send Another Email"}
            </button>

            <Link
              href="/login"
              className="block w-full rounded-[0.625rem] bg-primary p-4 text-center font-semibold text-white transition-colors duration-200 hover:bg-[#62A9DC]"
              prefetch={false}
            >
              Back to Login
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Icon Header */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
          </div>

          {/* Title Section */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold text-primary lg:text-4xl">
              Reset Your Password
            </h1>
            <p className="text-[#1E1E1E]">
              You forgot your password? No worries! Enter your email address
              below and we&apos;ll send you instructions to reset your password.
            </p>
          </div>

          <hr className="mb-8 bg-[#7F7F7F]" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <NewFormInput
              name="email"
              type="email"
              label="Email Address"
              placeholder="e.g. name@domain.com"
              autoComplete="email"
              error={errors.email}
              register={register}
            />

            <div className="space-y-4">
              <HCaptcha {...captchaProps} />

              <SubmitButton
                isPending={isSubmitting}
                pendingText="Submitting..."
                defaultText="Submit"
                disabled={!captchaToken}
              />

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-primary hover:underline"
                  prefetch={false}
                >
                  Back to Login
                </Link>
              </div>
            </div>

            <hr className="my-4 bg-[#7F7F7F]" />

            <p className="text-center text-xs text-[#626060]">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
                prefetch={false}
              >
                Log in here
              </Link>
            </p>
          </form>
        </>
      )}
    </div>
  );
}
