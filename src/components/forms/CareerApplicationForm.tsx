"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { toast } from "sonner";
import { Paperclip, X } from "lucide-react";
import { FormTextArea, NewFormInput } from "./FormInput";
import SubmitButton from "./SubmitButton";
import useHCaptcha from "@/hooks/useHCaptcha";
import { jobApplicationSchema } from "@/lib/zodSchemas";
import {
  getCVUploadSignature,
  submitJobApplicationAction,
} from "@/app/(general-view)/careers/[slug]/serverActions";
import { z } from "zod";

type FormFields = Omit<z.infer<typeof jobApplicationSchema>, "cvUrl">;

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export default function CareerApplicationForm({
  roleSlug,
}: {
  roleSlug: string;
}) {
  const { captchaToken, resetCaptcha, captchaProps } = useHCaptcha();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormFields>({
    resolver: zodResolver(jobApplicationSchema.omit({ cvUrl: true })),
    shouldFocusError: true,
  });

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCvError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/\.(pdf|docx?|)$/i.test(file.name)) {
      setCvError("Only PDF, DOC, or DOCX files are allowed.");
      setCvFile(null);
      return;
    }

    if (file.size > MAX_CV_SIZE_BYTES) {
      setCvError("File size must be less than 5MB.");
      setCvFile(null);
      return;
    }

    setCvFile(file);
  }

  function removeFile() {
    setCvFile(null);
    setCvError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadCV(file: File): Promise<string> {
    const sigRes = await getCVUploadSignature({
      fileSize: file.size,
      fileName: file.name,
    });
    if (!sigRes.success) throw new Error(sigRes.error);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("timestamp", `${sigRes.timestamp}`);
    formData.append("api_key", sigRes.api_key);
    formData.append("signature", sigRes.signature);
    formData.append("upload_preset", sigRes.upload_preset);
    formData.append("display_name", sigRes.display_name);
    formData.append("allowed_formats", sigRes.allowed_formats);
    formData.append("invalidate", `${sigRes.invalidate}`);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${sigRes.cloud_name}/raw/upload`;
    const response = await fetch(uploadUrl, { method: "POST", body: formData });
    const data = await response.json();
    if (!response.ok || !data.secure_url) {
      throw new Error("Failed to upload CV");
    }
    return data.secure_url as string;
  }

  async function onSubmit(data: FormFields) {
    try {
      if (!cvFile) {
        setCvError("Please attach your CV.");
        return;
      }
      if (!captchaToken) {
        toast.error("Please complete the captcha verification");
        return;
      }

      const cvUrl = await uploadCV(cvFile);

      const response = await submitJobApplicationAction(
        roleSlug,
        { ...data, cvUrl },
        captchaToken,
      );

      if (!response.success) return toast.error(response.message);

      toast.success(response.message, { duration: 4000 });
      reset();
      removeFile();
      resetCaptcha();
    } catch {
      toast.error(
        "An error occurred submitting your application. Please try again.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <NewFormInput
        name="fullName"
        type="text"
        label="Full Name"
        placeholder="E.g. Givename Surname"
        autoComplete="name"
        register={register}
        error={errors.fullName}
      />

      <NewFormInput
        name="email"
        type="email"
        label="Email Address"
        placeholder="e.g. name@gmail.com"
        autoComplete="email"
        register={register}
        error={errors.email}
      />

      <NewFormInput
        name="phone"
        type="tel"
        label="Phone Number"
        placeholder="e.g. 08012345678"
        autoComplete="tel"
        register={register}
        error={errors.phone}
      />

      <FormTextArea
        name="message"
        label="Message"
        required={false}
        placeholder="Anything you'd like us to know? (optional)"
        register={register}
        error={errors.message}
      />

      {/* CV upload */}
      <div>
        <label className="block max-w-max text-sm font-medium text-[#1e1e1e] after:ml-0.5 after:text-red-500 after:content-['*']">
          Upload CV
        </label>
        <div className="mt-2.5">
          {cvFile ? (
            <div className="flex items-center justify-between rounded-xl border border-transparent bg-[#EFEFEF] p-4">
              <span className="flex items-center gap-2 truncate text-sm text-neutral-500">
                <Paperclip className="size-4 shrink-0" />
                <span className="truncate">{cvFile.name}</span>
              </span>
              <button
                type="button"
                onClick={removeFile}
                className="shrink-0 text-neutral-500 hover:text-red-500"
                aria-label="Remove file"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="block w-full rounded-xl border border-dashed border-[#626060] bg-[#EFEFEF] p-4 text-center text-sm text-neutral-500 transition-all duration-200 hover:ring-3 hover:ring-[#62A9DC]/50"
            >
              Click to attach your CV (PDF, DOC, or DOCX &mdash; max 5MB)
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={onFileChange}
          />
        </div>
        {cvError && <p className="mt-1 text-sm text-red-500">{cvError}</p>}
      </div>

      <HCaptcha {...captchaProps} />

      <SubmitButton
        defaultText="Submit Application"
        pendingText="Submitting..."
        isPending={isSubmitting}
        disabled={!captchaToken}
      />
    </form>
  );
}
