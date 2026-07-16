"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PenLine, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { NewFormInput } from "@/components/forms/FormInput";
import SubmitButton from "@/components/forms/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  adminProfileSchema,
  type AdminProfileFormData,
} from "@/lib/zodSchemas";
import { updateAdminProfile } from "../serverAction";

export default function AdminProfileForm({
  profile: initialProfile,
}: {
  profile: AdminProfileFormData;
}) {
  const { loadUser } = useAuthContext();
  const [editMode, setEditMode] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AdminProfileFormData>({
    defaultValues: initialProfile,
    resolver: zodResolver(adminProfileSchema),
    shouldFocusError: true,
  });

  const onSubmit: SubmitHandler<AdminProfileFormData> = async (data) => {
    if (!isDirty) {
      setEditMode(false);
      toast.info("You did not make any changes to your profile.");
      return;
    }

    try {
      const result = await updateAdminProfile(data);

      if (!result.success) return void toast.error(result.message);

      toast.success(result.message);
      reset(result.data);
      setEditMode(false);
      await loadUser({ disableCookieCache: true });
    } catch {
      toast.error("Network error or server issue. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="overflow-hidden rounded-[1.75rem] border-white/70 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="mb-1 text-2xl text-slate-800">
                Personal Information
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6 text-slate-500">
                Update your personal details here.
              </CardDescription>
            </div>

            <Button
              type="button"
              onClick={() => {
                if (!editMode) {
                  setEditMode(true);
                  return;
                }

                reset();
                setEditMode(false);
              }}
              className={`flex items-center gap-2 rounded-full px-5 duration-300 ${editMode ? "border border-red-500 bg-transparent text-red-500 hover:bg-red-50" : "bg-slate-900 text-white hover:bg-slate-700"}`}
            >
              {!editMode ? (
                <>
                  <PenLine /> Edit Profile
                </>
              ) : (
                <>
                  <X /> Cancel
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <NewFormInput
            name="first_name"
            type="text"
            label="First Name"
            disabled={!editMode}
            error={errors.first_name}
            register={register}
            className="border border-slate-200 bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:hover:ring-0"
          />

          <NewFormInput
            name="middle_name"
            type="text"
            label="Middle Name"
            disabled={!editMode}
            required={false}
            error={errors.middle_name}
            register={register}
            className="border border-slate-200 bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:hover:ring-0"
          />

          <NewFormInput
            name="last_name"
            type="text"
            label="Last Name"
            disabled={!editMode}
            error={errors.last_name}
            register={register}
            className="border border-slate-200 bg-white shadow-gray-300 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:hover:ring-0"
          />

          {/* readonly email */}
          <div>
            <label className="block max-w-max text-sm font-medium text-[#1e1e1e]">
              Email
            </label>
            <input
              name="email"
              readOnly
              disabled
              defaultValue={initialProfile.email}
              className="mt-2.5 block w-full rounded-xl border border-[#EFEFEF] bg-[#EFEFEF] p-4 text-neutral-500 shadow-sm placeholder:text-[#626060] disabled:cursor-not-allowed"
            />
            <p className="mt-2 text-xs text-slate-500">
              Email can not be changed.
            </p>
          </div>
        </CardContent>

        {editMode && (
          <CardFooter className="border-t border-slate-100 bg-slate-50/60 py-6">
            <SubmitButton
              isPending={isSubmitting}
              pendingText="Saving..."
              defaultText="Save Changes"
              disabled={!isDirty}
              className="mt-0 w-full md:w-auto md:min-w-44"
            />
          </CardFooter>
        )}
      </Card>
    </form>
  );
}
