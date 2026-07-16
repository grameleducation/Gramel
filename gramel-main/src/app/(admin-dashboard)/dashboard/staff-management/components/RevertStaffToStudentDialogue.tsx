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
import {
  Loader2,
  Users,
  UserRoundX,
  XIcon,
  AlertCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Nullable } from "@/lib/types";
import { Staff } from "../types";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { revertStaffToStudentAction } from "../serverActions";

async function getAssignedStudentsCount(staffId: string): Promise<number> {
  const res = await fetch(
    `/api/admin-dashboard/staff-management/assigned-students-count?staffId=${staffId}`,
  );
  const payload = await res.json();

  if (!res.ok || !payload.success) {
    throw new Error(payload.error || "Failed to get assigned students count");
  }

  return payload.data;
}

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

export default function RevertStaffToStudentDialogue({
  open,
  staff,
  onClose,
  refetchStaff,
}: {
  open: boolean;
  staff: Nullable<Staff>;
  onClose: () => void;
  refetchStaff: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<unknown, Error>>;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [action, setAction] = useState<
    "redistribute" | "assign" | "unassign" | null
  >(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | undefined>(
    undefined,
  );
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  // Query to fetch assigned students count
  const {
    data: studentsCount,
    error: assignedStudentsError,
    isFetching: isFetchingStudents,
    refetch: refetchAssignedStudents,
  } = useQuery({
    queryKey: ["assigned-students-count", staff?.id || ""],
    queryFn: () => getAssignedStudentsCount(staff?.id || ""),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
    enabled: !!staff && open,
  });

  // Query to fetch available staff for redistribution
  const {
    data: availableStaff,
    error: availableStaffError,
    isFetching: isFetchingStaff,
    refetch: refetchAvailableStaff,
  } = useQuery({
    queryKey: ["staff-list", staff?.id || ""],
    queryFn: getAvailableStaffForAssignment,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
    enabled: !!staff && open && action === "assign",
  });

  if (!staff) return null;

  async function handleRevertToStudent() {
    if (!staff) return;

    setIsProcessing(true);

    try {
      const result = await revertStaffToStudentAction({
        staffId: staff.id,
        action,
        selectedStaffId,
      });

      if (!result.success) return void toast.error(result.message);

      // Invalidate all queries and refresh staff list
      onClose();
      queryClient.invalidateQueries();
      refetchStaff();
      toast.success(result.message || "Staff reverted to student successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to revert staff to student. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(op) => !op && onClose()}>
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
            Revert Staff to Student
          </AlertDialogTitle>

          <AlertDialogDescription className="text-base text-gray-700">
            You are about to revert{" "}
            <strong>
              {staff.first_name} {staff.middle_name} {staff.last_name}
            </strong>{" "}
            with email <strong>{staff.email}</strong> from a staff role to a
            student.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Loading state */}
          {isFetchingStudents ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              <span>Checking for assigned students...</span>
            </div>
          ) : // Error state
          assignedStudentsError ? (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircleIcon className="size-4" />
              <span>Error checking for assigned students</span>
              <Button
                variant="outline"
                onClick={() => refetchAssignedStudents()}
                className="bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
              >
                Retry
              </Button>
            </div>
          ) : studentsCount && studentsCount > 0 ? (
            <div className="space-y-4">
              <div className="rounded-md bg-amber-50 p-4 text-amber-800">
                <div className="flex items-start gap-2">
                  <Users className="size-5 shrink-0" />
                  <div>
                    <p className="font-bold">
                      {studentsCount} student
                      {studentsCount !== 1 ? "s are" : " is"} currently assigned
                      to this staff member.
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      What would you like to do with these students?
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="flex items-start gap-3 has-[[disabled]]:cursor-not-allowed has-[[disabled]]:opacity-50">
                  <Checkbox
                    checked={action === "redistribute"}
                    onCheckedChange={() => setAction("redistribute")}
                    disabled={isProcessing}
                    className="border-primary data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300 data-[state=checked]:text-white"
                  />
                  <p className="text-sm leading-none font-medium">
                    Distribute students to other staff members
                  </p>
                </Label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Label className="flex items-start gap-3 has-[[disabled]]:cursor-not-allowed has-[[disabled]]:opacity-50">
                    <Checkbox
                      checked={action === "assign"}
                      onCheckedChange={() => setAction("assign")}
                      disabled={isProcessing}
                      className="border-primary data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300 data-[state=checked]:text-white"
                    />
                    <p className="text-sm leading-none font-medium">
                      Assign students to another staff
                    </p>
                  </Label>
                  {action === "assign" && (
                    <div className="grow">
                      {isFetchingStaff ? (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading available staff...</span>
                        </div>
                      ) : availableStaffError ? (
                        <div className="flex items-center space-x-2 text-sm text-red-500">
                          <AlertCircleIcon className="h-4 w-4" />
                          <span>Error loading available staff</span>
                          <Button
                            variant="outline"
                            onClick={() => refetchAvailableStaff()}
                            className="bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
                          >
                            Retry
                          </Button>
                        </div>
                      ) : availableStaff && availableStaff.length > 0 ? (
                        <Select
                          value={selectedStaffId}
                          onValueChange={setSelectedStaffId}
                        >
                          <SelectTrigger
                            className="w-full rounded-md focus-visible:border-primary-300 focus-visible:ring-primary-300"
                            chevronClassName="opacity-100"
                          >
                            <SelectValue placeholder="Select a staff member" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableStaff.map((st) => {
                              if (st.id === staff.id) return null;
                              return (
                                <SelectItem
                                  key={st.id}
                                  value={st.id}
                                  className="focus:bg-primary-300/10"
                                >
                                  {st.first_name} {st.middle_name}{" "}
                                  {st.last_name}
                                  {st.id === user?.id ? " (Yourself)" : ""}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No other staff members available for redistribution.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <Label className="flex items-start gap-3 has-[[disabled]]:cursor-not-allowed has-[[disabled]]:opacity-50">
                  <Checkbox
                    checked={action === "unassign"}
                    onCheckedChange={() => setAction("unassign")}
                    className="border-primary data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300 data-[state=checked]:text-white"
                  />
                  <p className="text-sm leading-none font-medium">
                    Unassign all students (no staff will be assigned to the
                    students)
                  </p>
                </Label>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <Users className="h-5 w-5" />
              <span>
                No students are currently assigned to this staff member.
              </span>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <Button
            disabled={isProcessing}
            onClick={() => {
              setAction(null);
              setSelectedStaffId(undefined);
              onClose();
            }}
            className="cursor-pointer bg-red-500 duration-200 hover:bg-red-700 hover:text-white focus-visible:border-0 focus-visible:ring-0 disabled:pointer-events-auto disabled:cursor-not-allowed"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRevertToStudent}
            disabled={
              isFetchingStudents ||
              !!assignedStudentsError ||
              isFetchingStaff ||
              !!availableStaffError ||
              (studentsCount &&
                studentsCount > 0 &&
                (!action || (action === "assign" && !selectedStaffId))) ||
              isProcessing
            }
            className="cursor-pointer duration-200 hover:bg-primary-300 hover:text-white disabled:pointer-events-auto disabled:cursor-not-allowed disabled:bg-primary"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Reverting to Student
              </>
            ) : (
              <>
                <UserRoundX className="mr-2 size-4" />
                Revert to Student
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
