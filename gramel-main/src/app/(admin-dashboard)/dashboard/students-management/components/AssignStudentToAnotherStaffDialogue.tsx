"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { useState, useTransition } from "react";
import type { StudentData } from "../[student_id]/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Nullable } from "@/lib/types";
import { assignStudentToStaffAction } from "../serverActions";

async function getAvailableStaffForAssignment(): Promise<
  {
    id: string;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    role: string;
  }[]
> {
  const res = await fetch(
    "/api/admin-dashboard/staff-management/available-staff",
  );
  const payload = await res.json();

  if (!res.ok || !payload.success) {
    throw new Error(payload.error || "Failed to get available staff");
  }

  return payload.data;
}

export default function AssignStudentToAnotherStaffDialogue({
  open,
  student,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  student: Nullable<
    Pick<
      StudentData,
      | "id"
      | "first_name"
      | "middle_name"
      | "last_name"
      | "email"
      | "assigned_staff"
    >
  >;
}) {
  const router = useRouter();
  const { user, isUserLoading, handleLogout } = useAuthContext();

  const [submitting, startTransition] = useTransition();
  const [selectedStaff, setSelectedStaff] = useState<string | undefined>(
    undefined,
  );

  const {
    data: staff,
    error: staffError,
    isFetching: staffIsFetching,
    refetch: refetchStaff,
  } = useQuery({
    queryKey: ["staff-list"],
    queryFn: getAvailableStaffForAssignment,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
    enabled: open,
  });
  const queryClient = useQueryClient();

  function assignStudentToStaff() {
    startTransition(async () => {
      if (isUserLoading) {
        toast.info("User loading. Please wait a moment and try again.", {
          position: "bottom-right",
        });
        return;
      }

      if (!student) {
        toast.error("No student selected");
        return;
      }

      if (!selectedStaff) {
        toast.info(
          "Please select the new staff you want to assign this student to",
        );
        return;
      }

      try {
        const result = await assignStudentToStaffAction({
          studentId: student.id,
          selectedStaffId: selectedStaff,
        });

        if (!result.success) {
          toast.error(result.message);
          if (
            result.message.toLowerCase().includes("not authorized") ||
            result.message.toLowerCase().includes("must be logged in")
          ) {
            onClose();
            await handleLogout();
          }
          return;
        }

        router.refresh();
        queryClient.invalidateQueries();

        setSelectedStaff(undefined);
        toast.success(
          result.message || "Student assigned to staff successfully!",
        );
        onClose();
      } catch {
        toast.error("Failed to assign student to staff");
      }
    });
  }

  if (!student) return null;

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
            Assign Student To Another Staff
          </AlertDialogTitle>

          <AlertDialogDescription asChild className="text-base text-gray-700">
            <div>
              <p className="">
                You want to assign this student{" "}
                <strong>
                  {student.first_name} {student.middle_name} {student.last_name}{" "}
                  ({student.email})
                </strong>{" "}
                to another staff. This student is currently assigned to
                <strong>
                  {student.assigned_staff ? (
                    <>
                      {" "}
                      staff {student.assigned_staff.first_name}{" "}
                      {student.assigned_staff.middle_name}{" "}
                      {student.assigned_staff.last_name}
                    </>
                  ) : (
                    " no staff"
                  )}
                </strong>
              </p>

              <div className="mt-4 space-y-2">
                {staffError ? (
                  <p className="rounded-lg bg-red-500 p-2 text-sm text-white">
                    Error occured while getting staff list. Please check your
                    internet connection, then close the dialogue and try again.
                    <Button
                      onClick={() => refetchStaff()}
                      variant="outline"
                      className="ml-2 cursor-pointer text-red-500 hover:bg-red-700 hover:text-white"
                    >
                      retry
                    </Button>
                  </p>
                ) : staffIsFetching ? (
                  <p className="flex items-center gap-2 font-bold">
                    <LoaderCircleIcon className="size-4 animate-spin" />
                    Loading staff list...
                  </p>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <p>
                      Select the new staff you want to assign this student to:
                    </p>
                    <Select
                      value={selectedStaff}
                      onValueChange={setSelectedStaff}
                    >
                      <SelectTrigger
                        className="grow rounded-md bg-light-gray-100 focus-visible:border-primary-300 focus-visible:ring-primary-300"
                        chevronClassName="opacity-100"
                      >
                        <SelectValue placeholder="Select staff" />
                      </SelectTrigger>
                      <SelectContent className="p-2" align="end">
                        {staff?.map((st) =>
                          st.id === student.assigned_staff?.id ? null : (
                            <SelectItem
                              key={st.id}
                              value={st.id}
                              className="focus:bg-primary-300/10"
                            >
                              {st.first_name} {st.middle_name} {st.last_name}
                              {st.id === user?.id ? " (Yourself)" : ""}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6">
          <Button
            disabled={submitting}
            onClick={() => {
              onClose();
              setSelectedStaff(undefined);
            }}
            className="cursor-pointer bg-red-500 duration-200 hover:bg-red-700 hover:text-white disabled:pointer-events-auto disabled:cursor-not-allowed"
          >
            Cancel
          </Button>
          <Button
            disabled={
              submitting || staffIsFetching || !!staffError || !selectedStaff
            }
            onClick={assignStudentToStaff}
            className="cursor-pointer duration-200 hover:bg-primary-300 hover:text-white disabled:pointer-events-auto disabled:cursor-not-allowed disabled:bg-primary"
          >
            {submitting && <LoaderCircleIcon className="size-4 animate-spin" />}
            Assign{submitting ? "ing" : ""} to{" "}
            {selectedStaff === user?.id ? "yourself" : "staff"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
