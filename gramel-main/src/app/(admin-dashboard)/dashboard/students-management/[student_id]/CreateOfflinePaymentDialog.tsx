"use client";

import { useState } from "react";
import { LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { servicesDetails } from "@/app/(general-view)/services/[slug]/servicesData";
import { getCloudinaryUploadSignature } from "@/app/(general-view)/student-profile/serverAction";
import { createOfflinePaymentEntry } from "./serverActions";
import { NewFormInput, FormSelect } from "@/components/forms/FormInput";
import { StudentData } from "./types";
import { offlinePaymentSchema } from "@/lib/zodSchemas";
import { DatePicker } from "@/components/DatePicker";
import { Nullable } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type OfflinePaymentFormValues = z.infer<typeof offlinePaymentSchema>;

export default function CreateOfflinePaymentDialog({
  studentData,
}: {
  studentData: StudentData;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OfflinePaymentFormValues>({
    resolver: zodResolver(offlinePaymentSchema),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedServiceSlug = watch("serviceSlug");
  const service = selectedServiceSlug
    ? servicesDetails[selectedServiceSlug]
    : null;
  const hasTests = service && Array.isArray(service.tests);
  const hasApplicationOptions =
    service && Array.isArray(service.applicationOptions);

  function resetForm() {
    reset();
    setFileError(null);
    setPreview(null);
    setSelectedFile(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    setSelectedFile(null);
    setPreview(null);

    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (!/(jpg|jpeg|png)$/i.test(file.type)) {
      return setFileError("Only JPG, JPEG, or PNG files are allowed.");
    }

    if (file.size > 1024 * 1024) {
      return setFileError("File size must be less than 1MB.");
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") setPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(values: OfflinePaymentFormValues) {
    try {
      let proofUrl: Nullable<string>;
      let deleteToken: Nullable<string>;
      let cloudName: Nullable<string>;

      if (selectedFile) {
        const sigRes = await getCloudinaryUploadSignature({
          fileSize: selectedFile.size,
          assetType: "offline_proof_of_payments",
          fileName: selectedFile.name,
        });
        if (!sigRes.success) {
          return toast.error(sigRes.error || "Error preparing file upload");
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("timestamp", `${sigRes.timestamp || ""}`);
        formData.append("api_key", sigRes.api_key || "");
        formData.append("signature", sigRes.signature || "");
        formData.append("upload_preset", sigRes.upload_preset || "");
        formData.append("display_name", sigRes.display_name || "");
        formData.append("allowed_formats", sigRes.allowed_formats || "");
        formData.append("invalidate", `${sigRes.invalidate || ""}`);
        formData.append("return_delete_token", "true");

        const uploadUrl = `https://api.cloudinary.com/v1_1/${sigRes.cloud_name}/image/upload`;

        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadResponse.json();
        if (!uploadData.secure_url) {
          return toast.error("Failed to upload proof of payment");
        }
        proofUrl = uploadData.secure_url;
        deleteToken = uploadData.delete_token;
        cloudName = sigRes.cloud_name;
      }

      const res = await createOfflinePaymentEntry({
        studentId: studentData.id,
        serviceSlug: values.serviceSlug,
        selectedOptionName: values.optionName || undefined,
        amountInNaira: values.amountNaira,
        paidAt: values.paidAt,
        proofOfPaymentUrl: proofUrl,
      });

      if (!res.success) {
        if (deleteToken) {
          await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({ token: deleteToken }),
            },
          );
        }
        return toast.error(
          res.error || "Failed to create offline payment entry.",
        );
      }

      queryClient.invalidateQueries();
      router.refresh();
      toast.success("Payment entry created successfully.");
      resetForm();
      setIsOpen(false);
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  const serviceOptions = Object.entries(servicesDetails).map(([slug, svc]) => ({
    slug,
    title: svc.title,
  }));

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" className="whitespace-nowrap">
          <Plus className="size-4" />
          Create offline payment
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primary">
            Create Offline Payment Entry
          </AlertDialogTitle>
          <AlertDialogDescription>
            Record a payment made via offline method for this student:{" "}
            <strong className="text-primary-300">
              {studentData.first_name} {studentData.middle_name}{" "}
              {studentData.last_name}
            </strong>
            . You can optionally attach proof of payment.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <FormSelect
            name="serviceSlug"
            label="Service paid for"
            control={control}
            options={serviceOptions.map((svc) => ({
              value: svc.slug,
              label: svc.title,
            }))}
            placeholder="Select a service"
            disabled={isSubmitting}
          />

          {service && hasTests && service.tests && (
            <FormSelect
              control={control}
              name="optionName"
              label="Test type"
              options={service.tests.map((test) => test.name)}
              placeholder="Select test"
              disabled={isSubmitting}
            />
          )}

          {service && hasApplicationOptions && service.applicationOptions && (
            <FormSelect
              control={control}
              name="optionName"
              label="Application package"
              options={service.applicationOptions.map((opt) => opt.name)}
              placeholder="Select package"
              disabled={isSubmitting}
            />
          )}

          {/* MARK: TODO: Add comma support for amount */}
          <NewFormInput
            name="amountNaira"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter amount in Naira"
            label="Amount paid (₦)"
            register={register}
            error={errors.amountNaira}
            disabled={isSubmitting}
            className="border border-[#EFEFEF] bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:hover:ring-0"
          />

          <DatePicker
            name="paidAt"
            control={control}
            label="Offline payment date"
            disabled={isSubmitting}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Proof of payment (optional)
            </label>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              Only JPG, JPEG, or PNG. Max size 1MB.
            </p>
            {fileError && <p className="text-xs text-red-500">{fileError}</p>}
            {preview && (
              <div className="mt-2">
                <p className="mb-1 text-xs font-medium text-gray-600">
                  Preview:
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Proof of payment preview"
                  className="max-h-40 w-auto rounded-md border object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            className="cursor-pointer bg-red-500 text-white duration-200 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed"
            disabled={isSubmitting}
            onClick={resetForm}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="cursor-pointer duration-200"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Create offline payment"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
