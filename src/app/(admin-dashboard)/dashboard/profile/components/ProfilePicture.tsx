"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, LoaderCircle, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
import { type Nullable } from "@/lib/types";
import {
  getCloudinaryUploadSignature,
  updateProfilePicture,
} from "@/app/(general-view)/student-profile/serverAction";

interface ProfilePictureForm {
  image: FileList;
}

export default function ProfilePicture() {
  const { user, loadUser } = useAuthContext();
  const [preview, setPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<Nullable<string>>(
    user?.profile_picture_url,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm<ProfilePictureForm>();

  function resetImageData() {
    setPreview(null);
    setSelectedFile(null);
    setProgress(0);
    reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    clearErrors("image");
    const file = e.target.files?.[0];
    setSelectedFile(null);
    if (!file) return;

    if (!/(jpg|jpeg|png)$/i.test(file.type)) {
      setError("image", {
        type: "manual",
        message: "Only JPG, JPEG, or PNG files are allowed.",
      });
      return;
    }

    if (file.size > 1024 * 1024) {
      resetImageData();
      setError("image", {
        type: "manual",
        message: "File size must be less than 1MB.",
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!selectedFile) return;

    setIsSaving(true);
    setProgress(0);
    try {
      const sigRes = await getCloudinaryUploadSignature({
        fileSize: selectedFile.size,
        assetType: "profile_pictures",
        fileName: selectedFile.name,
      });
      if (!sigRes.success) {
        toast.error(sigRes.error || "Error uploading profile picture");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("public_id", sigRes.public_id || "");
      formData.append("timestamp", `${sigRes.timestamp || ""}`);
      formData.append("api_key", sigRes.api_key || "");
      formData.append("signature", sigRes.signature || "");
      formData.append("upload_preset", sigRes.upload_preset || "");
      formData.append("display_name", sigRes.display_name || "");
      formData.append("allowed_formats", sigRes.allowed_formats || "");
      formData.append("invalidate", `${sigRes.invalidate || ""}`);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${sigRes.cloud_name}/image/upload`;
      const uploadData = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", uploadUrl);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              setProgress(Math.round((event.loaded / event.total) * 100));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const data = JSON.parse(xhr.responseText);
                if (data.secure_url) resolve(data);
                else reject(new Error("No secure_url in Cloudinary response"));
              } catch (err) {
                reject(err);
              }
            } else {
              reject(new Error("Failed to upload image to Cloudinary"));
            }
          };

          xhr.onerror = () =>
            reject(new Error("Failed to upload image to Cloudinary"));

          xhr.send(formData);
        },
      );

      if (
        uploadData.secure_url &&
        uploadData.secure_url !== profilePictureUrl
      ) {
        const updateRes = await updateProfilePicture(uploadData.secure_url);
        if (!updateRes.success) {
          toast.error(updateRes.error || "Failed to update profile picture");
          return;
        }
      }

      toast.success("Profile picture updated successfully!");
      setProfilePictureUrl(uploadData.secure_url);
      resetImageData();
      loadUser({ disableCookieCache: true }); // can be awaited when necessary
    } catch {
      toast.error("Error uploading profile picture");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="overflow-hidden rounded-[1.75rem] border-white/70 bg-white/90 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm">
      <div className="bg-slate-900 px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/10 p-2">
            <Camera className="size-5" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">
              Profile Picture
            </CardTitle>
            <CardDescription className="text-slate-300">
              A clear headshot is advised.
            </CardDescription>
          </div>
        </div>
      </div>
      <CardContent className="px-6 py-6">
        <div className="flex flex-col items-center">
          <div className="relative max-w-full">
            <div className="flex size-50 max-w-full items-center justify-center overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-slate-100 via-slate-200 to-sky-100 ring-8 ring-slate-100 lg:size-55">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : profilePictureUrl ? (
                <Image
                  src={profilePictureUrl}
                  alt="Profile picture"
                  width={220}
                  height={220}
                  className="h-full w-full object-cover object-center"
                  priority
                />
              ) : (
                <span className="text-5xl text-gray-400 select-none">👤</span>
              )}
            </div>

            {!isSaving && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-2 bottom-2 rounded-full border border-gray-200 bg-white p-2 shadow-md transition-colors hover:bg-primary hover:text-white lg:right-3 lg:bottom-3 lg:p-3"
                aria-label="Edit profile picture"
              >
                <Pencil className="size-5" />
              </button>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
              {...register("image")}
              ref={fileInputRef}
              onChange={onFileChange}
            />
          </div>

          {!errors.image && !preview && !isSaving && (
            <small className="mt-2 max-w-xs text-center text-sm font-medium text-primary-300">
              Image size must be less than 1MB
            </small>
          )}

          {errors.image && (
            <p className="mt-2 text-sm text-red-500">{errors.image.message}</p>
          )}

          {isSaving && (progress === 0 || progress === 100) && (
            <div className="mt-4 w-full max-w-xs">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-full animate-pulse bg-primary" />
              </div>
              <div className="mt-1 text-center text-xs text-primary">
                Uploading...
              </div>
            </div>
          )}

          {isSaving && progress > 0 && progress < 100 && (
            <div className="mt-4 w-full max-w-xs">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1 text-center text-xs text-primary">
                {progress}%
              </div>
            </div>
          )}

          {preview && !errors.image && (
            <div className="mt-4 grid w-full max-w-xs grid-cols-2 gap-4">
              <Button
                type="button"
                variant="destructive"
                onClick={resetImageData}
                disabled={isSaving}
                className="w-full cursor-pointer hover:bg-red-400 disabled:cursor-not-allowed"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full cursor-pointer hover:bg-primary-300 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  progress < 100 ? (
                    "Uploading..."
                  ) : (
                    <>
                      <LoaderCircle className="size-4 animate-spin" /> Saving...
                    </>
                  )
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
