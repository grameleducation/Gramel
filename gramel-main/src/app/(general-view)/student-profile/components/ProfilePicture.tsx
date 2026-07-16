"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { LoaderCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getCloudinaryUploadSignature,
  updateProfilePicture,
} from "../serverAction";
import Image from "next/image";
import { usePathname } from "next/dist/client/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
import { Nullable } from "@/lib/types";

interface ProfilePictureForm {
  image: FileList;
}

export default function ProfilePicture() {
  const { user, loadUser } = useAuthContext();
  const [preview, setPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<Nullable<string>>(
    user?.profile_picture_url,
  );
  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm<ProfilePictureForm>();

  const pathname = usePathname();

  // reset image data when user cancels or saves
  function resetImageData() {
    setPreview(null);
    setSelectedFile(null);
    setProgress(0);
    reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // handle file change event when user selects a file
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    clearErrors("image");
    const file = e.target.files?.[0];
    setSelectedFile(null);
    if (!file) return;

    // check if file is a valid image
    if (!/(jpg|jpeg|png)$/i.test(file.type)) {
      setError("image", {
        type: "manual",
        message: "Only JPG, JPEG, or PNG files are allowed.",
      });
      return;
    }

    // check if file is greater than 1MB
    if (file.size > 1024 * 1024) {
      resetImageData();
      setError("image", {
        type: "manual",
        message: "File size must be less than 1MB.",
      });
      return;
    }

    setSelectedFile(file);
    // set preview image
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  // save button handler
  async function handleSave() {
    if (!selectedFile) return;
    setIsSaving(true);
    setProgress(0);
    try {
      // 1. Get Cloudinary signature and params
      const sigRes = await getCloudinaryUploadSignature({
        fileSize: selectedFile.size,
        assetType: "profile_pictures",
        fileName: selectedFile.name,
      });
      if (!sigRes.success) {
        toast.error(sigRes.error || "Error uploading profile picture");
        setIsSaving(false);
        return;
      }

      // 2. Upload to Cloudinary with progress
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

      // Cloudinary upload endpoint
      const uploadUrl = `https://api.cloudinary.com/v1_1/${sigRes.cloud_name}/image/upload`;
      const uploadData = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          // create XMLHttpRequest object
          const xhr = new XMLHttpRequest();
          // open POST request to Cloudinary upload endpoint
          xhr.open("POST", uploadUrl);

          // set upload onprogress event listener to update progress bar
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              setProgress(Math.round((event.loaded / event.total) * 100));
            }
          };

          // set upload onload event listener to handle successful upload
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const data = JSON.parse(xhr.responseText);
                if (data.secure_url) {
                  resolve(data);
                } else {
                  // if no secure_url in response, reject promise with error message
                  reject(new Error("No secure_url in Cloudinary response"));
                }
              } catch (err) {
                // if error parsing response, reject promise with error
                reject(err);
              }
            } else {
              // if upload fails, reject promise with error message
              reject(new Error("Failed to upload image to Cloudinary"));
            }
          };

          // set upload onerror event listener to handle failed upload
          xhr.onerror = () =>
            reject(new Error("Failed to upload image to Cloudinary"));

          // send form data to Cloudinary upload endpoint
          xhr.send(formData);
        },
      );

      // 3. Save new URL to db
      if (
        uploadData.secure_url &&
        uploadData.secure_url !== profilePictureUrl
      ) {
        const updateRes = await updateProfilePicture(uploadData.secure_url);
        if (!updateRes.success) {
          toast.error(updateRes.error || "Failed to update profile picture");
          setIsSaving(false);
          return;
        }
      }

      // clear form and reset state
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

  return pathname === "/student-profile" ? ( // Only render profile picture on profile page
    <Card className="max-lg:border-0 max-lg:shadow-none">
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative max-w-full">
            {/* Image container */}
            <div className="flex size-50 max-w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-200 lg:size-55">
              {preview ? (
                // preview image
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
                // default image
                <span className="text-5xl text-gray-400 select-none">👤</span>
              )}
            </div>
            {/* edit button */}
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

            {/* file input */}
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
              {...register("image")}
              ref={fileInputRef}
              onChange={onFileChange}
            />
          </div>
          {/* image size restrictions */}
          {!errors.image && !preview && !isSaving && (
            <small className="mt-2 max-w-xs text-center text-sm font-medium text-primary-300">
              Image size must be less than 1MB
            </small>
          )}

          {/* error message */}
          {errors.image && (
            <p className="mt-2 text-sm text-red-500">{errors.image.message}</p>
          )}

          {/* progress bar at 0 or 100% */}
          {isSaving && (progress === 0 || progress === 100) && (
            <div className="mt-4 w-full max-lg:max-w-xs">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-full animate-pulse bg-primary" />
              </div>
              <div className="mt-1 text-center text-xs text-primary">
                Uploading...
              </div>
            </div>
          )}
          {/* progress bar at 0% < progress < 100% */}
          {isSaving && progress > 0 && progress < 100 && (
            <div className="mt-4 w-full max-lg:max-w-xs">
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

          {/* save and cancel buttons */}
          {preview && !errors.image && (
            <div className="mt-4 grid w-full grid-cols-2 gap-4 max-lg:max-w-xs">
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
  ) : null;
}
