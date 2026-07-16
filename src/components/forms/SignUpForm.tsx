"use client";

import { NewFormInput } from "./FormInput";
import SubmitButton from "./SubmitButton";
import Link from "next/link";
import { Suspense } from "react";
import { signUpSchema } from "@/lib/zodSchemas";
import { z } from "zod";
import { toast } from "sonner";
import { signupAction } from "@/app/(general-view)/(auth)/serverActions";
import OAuthButtons from "./OAuthButtons";
import { LoaderCircle } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useHCaptcha from "@/hooks/useHCaptcha";
import { useSearchParams } from "next/navigation";
import { ExclamationOctagon } from "@/lib/icons";

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const errorMessage =
    searchParams.get("oauth-error") || searchParams.get("error");
  const { captchaToken, resetCaptcha, captchaProps } = useHCaptcha();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    shouldFocusError: true,
  });

  async function onSubmit(data: SignUpFormData) {
    if (!captchaToken) {
      toast.error("Please complete the captcha verification");
      return;
    }

    try {
      // Send to server action
      const response = await signupAction(data, captchaToken);

      // If success, reset form
      if (response.success) {
        toast.success(response.message);
        reset();
        resetCaptcha();
        return;
      }

      toast.error(response.message);
    } catch {
      toast.error("An error occurred. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <p className="mt-4 flex items-center justify-center gap-2 rounded-sm bg-red-500 p-2 px-4 font-semibold text-white">
          <ExclamationOctagon aria-hidden className="size-5 shrink-0" />
          {errorMessage}
        </p>
      )}
      <h4 className="text-center font-semibold text-[1e1e1e]">
        Create account with
      </h4>

      {/* oauth container */}
      <Suspense
        fallback={
          <div className="flex w-full items-center justify-center rounded-[0.625rem] border border-primary-300 px-7 py-4">
            <LoaderCircle className="animate-spin text-2xl text-primary-300" />
          </div>
        }
      >
        <OAuthButtons errorMessage={errorMessage} />
      </Suspense>

      {/* divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <hr className="w-full bg-[#7f7f7f]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-[#7f7f7f]">
            Or continue with your email
          </span>
        </div>
      </div>

      {/*  inputs container */}
      <div className="space-y-4">
        <div className="grid gap-4 xl:grid-cols-2">
          <NewFormInput
            name="first_name"
            type="text"
            label="First Name"
            placeholder="Your Given Name"
            autoComplete="given-name"
            error={errors.first_name}
            register={register}
          />
          <NewFormInput
            name="last_name"
            type="text"
            label="Last Name"
            placeholder="Your Surname"
            autoComplete="family-name"
            error={errors.last_name}
            register={register}
          />
        </div>

        <NewFormInput
          name="email"
          type="email"
          label="Email address"
          placeholder="e.g. name@gmail.com"
          autoComplete="email"
          error={errors.email}
          register={register}
        />

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="space-y-2.5">
            <NewFormInput
              name="password"
              type="password"
              label="Password"
              placeholder="Create Password"
              autoComplete="new-password"
              error={errors.password}
              register={register}
            />
            {!errors.password && (
              <small className="text-right text-xs text-[#626060] xl:text-left">
                8 characters minimum
              </small>
            )}
          </div>
          <NewFormInput
            name="confirm_password"
            type="password"
            label="Confirm Password"
            placeholder="Confirm Your Password"
            autoComplete="new-password"
            error={errors.confirm_password}
            register={register}
          />
        </div>
      </div>
      <div className="space-y-3">
        <HCaptcha {...captchaProps} />

        <SubmitButton
          isPending={isSubmitting}
          pendingText="Creating Account..."
          defaultText="Create Account"
          disabled={!captchaToken}
        />
        <p className="text-center text-sm text-[#1e1e1e]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>

      <hr className="my-4 bg-[#7F7F7F]" />

      <p className="text-center text-[0.625rem] text-black">
        By clicking on <strong>&ldquo;Create Account&rdquo;</strong>, you agree
        to our{" "}
        <Link
          href="#"
          className="font-semibold underline hover:no-underline"
          prefetch={false}
        >
          <strong>Terms and Conditions</strong>
        </Link>{" "}
        &amp;{" "}
        <Link
          href="#"
          className="font-semibold underline hover:no-underline"
          prefetch={false}
        >
          <strong>Privacy Policy</strong>
        </Link>
      </p>
    </form>
  );
}
