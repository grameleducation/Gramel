"use client";

import Link from "next/link";
import { NewFormInput } from "./FormInput";
import SubmitButton from "./SubmitButton";
import { Suspense } from "react";
import { z } from "zod";
import { loginSchema } from "@/lib/zodSchemas";
import { loginAction } from "@/app/(general-view)/(auth)/serverActions";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import OAuthButtons from "./OAuthButtons";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useHCaptcha from "@/hooks/useHCaptcha";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { ExclamationOctagon } from "@/lib/icons";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorMessage =
    searchParams.get("oauth-error") || searchParams.get("error");
  const { setUser } = useAuthContext();
  const { captchaToken, resetCaptcha, captchaProps } = useHCaptcha();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    shouldFocusError: true,
  });

  async function onSubmit(data: LoginFormData) {
    if (!captchaToken) {
      toast.error("Please complete the captcha verification");
      return;
    }

    try {
      // Send to server action
      const response = await loginAction(data, captchaToken);

      if (!response.success) return toast.error(response.message);

      // If login successful, reset form
      setUser(response.user);
      toast.success("Log in successful.", { duration: 3000 });
      reset();
      resetCaptcha();
      router.push("/");
    } catch (error) {
      console.error("Error submitting login form:", error);
      toast.error("An error occurred signing you in. Please try again.");
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

      {/*  inputs container */}
      <div className="space-y-4">
        <NewFormInput
          name="email"
          type="email"
          label="Email address"
          placeholder="e.g. name@gmail.com"
          autoComplete="email"
          error={errors.email}
          register={register}
        />

        {/* TODO: Add show password button */}
        <div className="space-y-2.5">
          <NewFormInput
            name="password"
            type="password"
            label="Password"
            placeholder="********"
            autoComplete="current-password"
            error={errors.password}
            register={register}
          />

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-primary hover:underline lg:text-sm"
              prefetch={false}
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <HCaptcha {...captchaProps} />

        <SubmitButton
          isPending={isSubmitting}
          pendingText="Logging In..."
          defaultText="Login"
          disabled={!captchaToken}
        />

        <p className="text-center text-sm text-[#1e1e1e]">
          Don&apos;t have an account with us?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:underline"
            prefetch={false}
          >
            Create Account
          </Link>
        </p>
      </div>

      {/* divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <hr className="w-full bg-[#7f7f7f]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-[#7f7f7f]">Or sign in with</span>
        </div>
      </div>

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

      <hr className="my-4 bg-[#7F7F7F]" />

      <p className="text-center text-[0.625rem] text-black">
        By clicking on <strong>&ldquo;Login&rdquo;</strong>, you agree to our{" "}
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
