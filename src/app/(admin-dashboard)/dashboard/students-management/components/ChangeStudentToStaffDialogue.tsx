"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Student } from "./types";
import { Nullable } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { AlertCircleIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoles } from "@/lib/permissions/role";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { changeStudentToStaffAction } from "../serverActions";

export default function ChangeStudentToStaffDialogue({
  open,
  student,
  onClose,
  refetchStudents,
}: {
  open: boolean;
  student: Nullable<Student>;
  onClose: () => void;
  refetchStudents: () => void;
}) {
  const [loading, startTransition] = useTransition();
  const { handleLogout, user, isUserLoading } = useAuthContext();
  const queryClient = useQueryClient();

  const formSchema = z.object({
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .refine((email) => email.toLowerCase() === student?.email.toLowerCase(), {
        message: "Email does not match",
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldFocusError: true,
  });

  if (!student) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      if (isUserLoading) {
        return void toast.info(
          "User loading. Please wait a moment and try again.",
          { position: "bottom-right" },
        );
      }

      if (user?.role !== UserRoles.admin) {
        onClose();
        toast.error("You are not authorized to perform this action");
        return await handleLogout();
      }

      try {
        const result = await changeStudentToStaffAction(student.id);

        if (!result.success) {
          toast.error(result.message || "Failed to change student to staff");
          if (
            result.message.toLowerCase().includes("not authorized") ||
            result.message.toLowerCase().includes("must be logged in")
          ) {
            onClose();
            await handleLogout();
          }
          return;
        }

        queryClient.invalidateQueries();
        refetchStudents();
        onClose();
        toast.success(
          result.message || "Student changed to staff successfully!",
        );
      } catch {
        toast.error("Failed to change student to staff");
      }
    });
  });

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogOverlay className="bg-transparent backdrop-blur-xs" />
      <AlertDialogContent className="sm:max-w-xl md:max-w-2xl">
        {/* Custom close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 flex size-10 cursor-pointer items-center justify-center rounded-sm bg-red-50 text-red-500 duration-300 hover:bg-red-100"
        >
          <XIcon className="size-5" />
        </button>

        <AlertDialogHeader>
          <AlertDialogTitle className="mb-4 text-center text-2xl text-primary">
            Confirm student change to staff
          </AlertDialogTitle>

          <AlertDialogDescription asChild className="text-base text-gray-700">
            <div>
              <p className="">
                Are you sure you want to change this student to staff? This will
                change{" "}
                <strong>
                  {student.first_name} {student.middle_name} {student.last_name}
                </strong>{" "}
                with email <strong>{student.email}</strong> to staff. The user
                will get the privilege to see and manage students.
              </p>
              <div className="mt-4 space-y-2">
                <p>
                  To confirm this action, please type the email{" "}
                  <strong className="text-primary-300">{student.email}</strong>{" "}
                  in the input field below:
                </p>
                <Input
                  type="email"
                  placeholder="Type email above here"
                  className="h-auto border border-light-gray-100 bg-light-gray-100 py-2 text-base! shadow-md placeholder:text-sm placeholder:text-[#626060] focus:outline-none focus-visible:ring-primary-300"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-3 flex items-center gap-2 rounded-sm bg-red-50 px-2 py-2 text-sm font-semibold text-red-500">
                    <AlertCircleIcon className="size-5" />
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel asChild>
            <Button
              disabled={loading}
              className="cursor-pointer bg-red-500 duration-200 hover:bg-red-700 hover:text-white focus-visible:border-0 focus-visible:ring-0 disabled:pointer-events-auto disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            disabled={loading}
            onClick={onSubmit}
            className="cursor-pointer duration-200 hover:bg-primary-300 hover:text-white disabled:pointer-events-auto disabled:cursor-not-allowed disabled:bg-primary"
          >
            {loading && <LoaderCircleIcon className="size-4 animate-spin" />}
            Chang{loading ? "ing" : "e"} to staff
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
