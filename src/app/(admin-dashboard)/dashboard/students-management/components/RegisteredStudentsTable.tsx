"use client";

import AgGridTable from "@/lib/AgGridTable";
import {
  type ColDef,
  type ICellRendererParams,
  themeMaterial,
} from "ag-grid-community";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import copyToClipboard from "@/utils/copyToClipboard";
import { RoundCopyAll } from "@/lib/icons";
import ChangeStudentToStaffDialogue from "./ChangeStudentToStaffDialogue";
import { Student } from "./types";
import { Nullable } from "@/lib/types";
import { UserActions, UserRoles } from "@/lib/permissions/role";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RequirePermission } from "@/components/auth/RequirePermission";
import AssignStudentToAnotherStaffDialogue from "./AssignStudentToAnotherStaffDialogue";

export default function RegisteredStudentsTable({
  page,
  setPage,
  studentsPerPage,
  setStudentsPerPage,
  showAdminAllStudentsToggle = false,
  adminStudentsFilter,
  setAdminStudentsFilter,
  totalStudents,
  loading,
  students,
  userRole,
  overlayNoRowsText,
  refetchStudents,
}: {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  studentsPerPage: number;
  setStudentsPerPage: React.Dispatch<React.SetStateAction<number>>;
  showAdminAllStudentsToggle?: boolean;
  adminStudentsFilter?: "all" | "my" | "unassigned"; // students
  setAdminStudentsFilter?: React.Dispatch<
    React.SetStateAction<"all" | "my" | "unassigned">
  >;
  totalStudents: number;
  loading: boolean;
  students: Student[];
  userRole: UserRoles;
  overlayNoRowsText?: string;
  refetchStudents: () => void;
}) {
  const [
    openAssignStudentToStaffDialogue,
    setOpenAssignStudentToStaffDialogue,
  ] = useState(false);
  const [
    openChangeStudentToStaffDialogue,
    setOpenChangeStudentToStaffDialogue,
  ] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<Nullable<Student>>(null);

  const totalPages = Math.ceil(totalStudents / studentsPerPage);
  const studentsMap = useMemo(() => {
    return new Map<string, Student>(
      students.map((student) => [student.id, student]),
    );
  }, [students]);

  const isAdmin = userRole === UserRoles.admin;

  const columnDefs: ColDef[] = [
    {
      headerName: "S/N",
      maxWidth: 100,
      valueGetter: (params) =>
        typeof params.node?.rowIndex === "number"
          ? params.node.rowIndex + 1 + (page - 1) * studentsPerPage
          : "",
    },
    {
      headerName: "Student ID",
      field: "id",
      filter: true,
      cellRenderer: (params: ICellRendererParams<Student>) => {
        const id = params.data?.id;
        if (!id) return "-";
        return (
          <div className="flex h-full items-center justify-center">
            <Tooltip>
              <TooltipTrigger
                className="flex h-7 cursor-pointer items-center gap-2 overflow-hidden rounded-sm bg-light-gray-100 px-2"
                onClick={() => copyToClipboard(id)}
              >
                <RoundCopyAll className="size-5 text-gray-600" /> {id}
              </TooltipTrigger>
              <TooltipContent>Copy student ID</TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
    {
      headerName: "First Name",
      field: "first_name",
      filter: true,
      valueFormatter: (params) =>
        params.value
          ? params.value
              .toString()
              .replace(/\b\w/g, (c: string) => c.toUpperCase()) // turn the first letter to uppercase
          : "-",
    },
    {
      headerName: "Middle Name",
      field: "middle_name",
      filter: true,
      valueFormatter: (params) =>
        params.value
          ? params.value
              .toString()
              .replace(/\b\w/g, (c: string) => c.toUpperCase())
          : "-",
    },
    {
      headerName: "Last Name",
      field: "last_name",
      filter: true,
      valueFormatter: (params) =>
        params.value
          ? params.value
              .toString()
              .replace(/\b\w/g, (c: string) => c.toUpperCase())
          : "-",
    },
    {
      headerName: "Email",
      field: "email",
      filter: true,
      cellRenderer: (params: ICellRendererParams<Student>) => {
        const email = params.data?.email;
        if (!email) return "-";
        return (
          <div className="flex h-full items-center justify-center">
            <Tooltip>
              <TooltipTrigger
                className="flex h-7 cursor-pointer items-center gap-2 overflow-hidden rounded-sm bg-light-gray-100 px-2"
                onClick={() => copyToClipboard(email.toLowerCase())}
              >
                <RoundCopyAll className="size-5 text-gray-600" />{" "}
                {email.toLowerCase()}
              </TooltipTrigger>
              <TooltipContent>Copy email</TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
    {
      headerName: "Phone",
      field: "phone",
      filter: true,
      valueFormatter: (params) => (params.value ? params.value : "-"),
    },
    {
      headerName: "Action",
      ...(userRole === "admin" ? {} : { resizable: false }), // Not resizable last column if user not admin
      cellRenderer: (props: ICellRendererParams<Student>) => {
        const id = props.data?.id;
        if (!id) return "-";
        return (
          <Link
            href={`/dashboard/students-management/${id}`}
            className="text-primary underline duration-200 hover:text-primary-300 hover:no-underline"
            prefetch={false}
          >
            View this Student
          </Link>
        );
      },
    },
    ...(isAdmin
      ? [
          {
            headerName: "Extras",
            resizable: false,
            cellRenderer: (props: ICellRendererParams<Student>) => {
              const id = props.data?.id;
              if (!id) return "-";
              return (
                <div className="grid h-full place-items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="hover:bg-white focus-visible:outline-0">
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-10 p-2">
                      <DropdownMenuItem
                        onClick={() =>
                          setTimeout(() => {
                            setSelectedStudent(studentsMap.get(id));
                            setOpenChangeStudentToStaffDialogue(true);
                          }, 100)
                        }
                        className="focus:bg-light-gray-100"
                      >
                        Change this student to staff
                      </DropdownMenuItem>
                      {adminStudentsFilter === "unassigned" ? ( // only show this item if admin is viewing unassigned students
                        <DropdownMenuItem
                          onClick={() =>
                            setTimeout(() => {
                              setSelectedStudent(studentsMap.get(id));
                              setOpenAssignStudentToStaffDialogue(true);
                            }, 100)
                          }
                          className="focus:bg-light-gray-100"
                        >
                          Assign student to a staff
                        </DropdownMenuItem>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            },
          },
        ]
      : []),
  ];

  const rangeStart = (page - 1) * studentsPerPage + 1;
  const rangeEnd = Math.min(page * studentsPerPage, totalStudents);

  const myTheme = themeMaterial.withParams({
    headerBackgroundColor: "#F9FAFB",
    headerColumnResizeHandleColor: "#C5C6CA",
  });

  return (
    <>
      {/* Table and pagination */}
      <div className="table-container-scrollbar-style w-full overflow-x-auto! rounded-2xl border border-[#e5e7eb] bg-white shadow-lg [&_.ag-cell]:text-center [&_.ag-header-cell-label]:justify-center">
        {/* Show admin all students toggle */}
        {showAdminAllStudentsToggle && (
          <RequirePermission
            role={userRole}
            action={UserActions.vew_all_students}
          >
            <div className="flex flex-wrap items-center gap-2 border-b border-[#e5e7eb] p-2 px-4">
              <span className="text-sm font-bold text-primary">Show:</span>
              <Label className="inline-flex items-start gap-3 rounded-lg p-3 hover:bg-gray-50 has-[[aria-checked=true]]:bg-light-gray-100 has-[[disabled]]:cursor-not-allowed has-[[disabled]]:opacity-50">
                <Checkbox
                  checked={adminStudentsFilter === "all"}
                  onCheckedChange={() => setAdminStudentsFilter?.("all")}
                  disabled={loading}
                  className="data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300 data-[state=checked]:text-white"
                />
                <p className="text-sm leading-none font-medium">All Students</p>
              </Label>
              <Label className="inline-flex items-start gap-3 rounded-lg p-3 hover:bg-gray-50 has-[[aria-checked=true]]:bg-light-gray-100 has-[[disabled]]:cursor-not-allowed has-[[disabled]]:opacity-50">
                <Checkbox
                  checked={adminStudentsFilter === "my"}
                  onCheckedChange={() => setAdminStudentsFilter?.("my")}
                  disabled={loading}
                  className="data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300 data-[state=checked]:text-white"
                />
                <p className="text-sm leading-none font-medium">My Students</p>
              </Label>
              <Label className="inline-flex items-start gap-3 rounded-lg p-3 hover:bg-gray-50 has-[[aria-checked=true]]:bg-light-gray-100 has-[[disabled]]:cursor-not-allowed has-[[disabled]]:opacity-50">
                <Checkbox
                  checked={adminStudentsFilter === "unassigned"}
                  onCheckedChange={() => setAdminStudentsFilter?.("unassigned")}
                  disabled={loading}
                  className="data-[state=checked]:border-primary-300 data-[state=checked]:bg-primary-300 data-[state=checked]:text-white"
                />
                <p className="text-sm leading-none font-medium">
                  Unassigned Students
                </p>
              </Label>
            </div>
          </RequirePermission>
        )}

        <AgGridTable<Student>
          rowData={students}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          suppressCellFocus
          alwaysShowHorizontalScroll
          scrollbarWidth={8}
          autoSizeStrategy={{ type: "fitCellContents" }}
          theme={myTheme}
          loading={loading}
          overlayLoadingTemplate="<div style='width: 40px; height: 40px; border-radius: 100%; border: 4px solid var(--color-primary); border-bottom-color: transparent; animation: spin 1s linear infinite;'></div>"
          overlayNoRowsTemplate={`<span style='font-size: 1rem; color: #4a5565'>${overlayNoRowsText || (isAdmin ? "No students to show" : "No students assigned to you yet")}</span>`}
        />

        <div className="flex flex-wrap items-center justify-end gap-4 border-t py-4 pr-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <label htmlFor="pageSelect" className="font-medium">
              Jump to page
            </label>
            <Select
              disabled={loading}
              value={page.toString()}
              onValueChange={(val) => setPage(Number(val))}
            >
              <SelectTrigger
                id="pageSelect"
                size="sm"
                className="min-w-16 px-2 focus-visible:border-gray-300 focus-visible:ring-gray-300"
              >
                <SelectValue placeholder="1" />
              </SelectTrigger>
              <SelectContent className="min-w-16 p-0.5">
                {Array.from({ length: totalPages }, (_, i) => (
                  <SelectItem
                    className="focus:bg-light-gray-100"
                    key={i + 1}
                    value={(i + 1).toString()}
                  >
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="studentsPerPageSelect" className="font-medium">
              Students per page
            </label>
            <Select
              disabled={loading}
              value={studentsPerPage.toString()}
              onValueChange={(val) => setStudentsPerPage(Number(val))}
            >
              <SelectTrigger
                id="studentsPerPageSelect"
                size="sm"
                className="min-w-16 px-2 focus-visible:border-gray-300 focus-visible:ring-gray-300"
              >
                <SelectValue placeholder="20" />
              </SelectTrigger>
              <SelectContent className="min-w-16 p-0.5">
                <SelectItem className="focus:bg-light-gray-100" value="20">
                  20
                </SelectItem>
                <SelectItem className="focus:bg-light-gray-100" value="50">
                  50
                </SelectItem>
                <SelectItem className="focus:bg-light-gray-100" value="100">
                  100
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span>
              Students: {rangeStart}-{rangeEnd} of {totalStudents}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={loading || page <= 1}
                className="rounded border border-gray-300 p-1 transition-colors duration-200 hover:border-gray-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-transparent disabled:opacity-50"
                title="Previous page"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={loading || page >= totalPages}
                className="rounded border border-gray-300 p-1 transition-colors duration-200 hover:border-gray-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-transparent disabled:opacity-50"
                title="Next page"
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change student to staff dialogue */}
      <ChangeStudentToStaffDialogue
        open={openChangeStudentToStaffDialogue}
        student={selectedStudent}
        onClose={() => {
          setOpenChangeStudentToStaffDialogue(false);
          setSelectedStudent(null);
        }}
        refetchStudents={refetchStudents}
      />

      <AssignStudentToAnotherStaffDialogue
        open={openAssignStudentToStaffDialogue}
        student={selectedStudent}
        onClose={() => {
          setOpenAssignStudentToStaffDialogue(false);
          setSelectedStudent(null);
        }}
      />
    </>
  );
}
