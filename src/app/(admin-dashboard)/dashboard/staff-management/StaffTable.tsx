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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RevertStaffToStudentDialogue from "./components/RevertStaffToStudentDialogue";
import { Nullable } from "@/lib/types";
import { Staff } from "./types";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

const myTheme = themeMaterial.withParams({
  headerBackgroundColor: "#F9FAFB",
  headerColumnResizeHandleColor: "#C5C6CA",
});

export default function StaffTable({
  page,
  setPage,
  staffPerPage,
  setStaffPerPage,
  totalStaff,
  loading,
  staff,
  refetchStaff,
}: {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  staffPerPage: number;
  setStaffPerPage: React.Dispatch<React.SetStateAction<number>>;
  totalStaff: number;
  loading: boolean;
  staff: Staff[];
  refetchStaff: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<unknown, Error>>;
}) {
  const [selectedStaff, setSelectedStaff] = useState<Nullable<Staff>>(null);
  const [
    openRevertStaffToStudentDialogue,
    setOpenRevertStaffToStudentDialogue,
  ] = useState(false);
  const totalPages = Math.ceil(totalStaff / staffPerPage);

  const staffMap = useMemo(() => {
    return new Map<string, Staff>(staff.map((staff) => [staff.id, staff]));
  }, [staff]);

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "S/N",
        maxWidth: 100,
        valueGetter: (params) =>
          typeof params.node?.rowIndex === "number"
            ? params.node.rowIndex + 1 + (page - 1) * staffPerPage
            : "",
      },
      {
        headerName: "Staff ID",
        field: "id",
        filter: true,
        cellRenderer: (params: ICellRendererParams<Staff>) => {
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
                <TooltipContent>Copy staff ID</TooltipContent>
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
        cellRenderer: (params: ICellRendererParams<Staff>) => {
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
        minWidth: 200,
        cellRenderer: (props: ICellRendererParams<Staff>) => {
          const id = props.data?.id;
          if (!id) return "-";
          return (
            <Link
              href={`/dashboard/staff-management/${id}`}
              className="text-primary underline duration-200 hover:text-primary-300 hover:no-underline"
              prefetch={false}
            >
              View assigned students
            </Link>
          );
        },
      },
      {
        headerName: "Extras",
        resizable: false,
        cellRenderer: (props: ICellRendererParams<Staff>) => {
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
                    onClick={() => {
                      setTimeout(() => {
                        setSelectedStaff(staffMap.get(id));
                        setOpenRevertStaffToStudentDialogue(true);
                      }, 100);
                    }}
                    className="focus:bg-light-gray-100"
                  >
                    Revert this staff to student
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [page, staffPerPage, staffMap],
  );

  const rangeStart = totalStaff ? (page - 1) * staffPerPage + 1 : 0;
  const rangeEnd = totalStaff ? Math.min(page * staffPerPage, totalStaff) : 0;

  return (
    <div className="table-container-scrollbar-style w-full overflow-x-auto! rounded-2xl border border-[#e5e7eb] bg-white shadow-lg [&_.ag-cell]:text-center [&_.ag-header-cell-label]:justify-center">
      <AgGridTable<Staff>
        rowData={staff}
        columnDefs={columnDefs}
        domLayout="autoHeight"
        suppressCellFocus
        alwaysShowHorizontalScroll
        scrollbarWidth={8}
        autoSizeStrategy={{ type: "fitCellContents" }}
        theme={myTheme}
        loading={loading}
        overlayLoadingTemplate="<div style='width: 40px; height: 40px; border-radius: 100%; border: 4px solid var(--color-primary); border-bottom-color: transparent; animation: spin 1s linear infinite;'></div>"
        overlayNoRowsTemplate="<span style='font-size: 1rem; color: #4a5565'>No staff to show</span>"
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
          <label htmlFor="staffPerPageSelect" className="font-medium">
            Staff per page
          </label>
          <Select
            disabled={loading}
            value={staffPerPage.toString()}
            onValueChange={(val) => setStaffPerPage(Number(val))}
          >
            <SelectTrigger
              id="staffPerPageSelect"
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
            Staff: {rangeStart}-{rangeEnd} of {totalStaff}
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

      {/* Revert Staff to Student Dialogue */}
      <RevertStaffToStudentDialogue
        open={openRevertStaffToStudentDialogue}
        staff={selectedStaff}
        onClose={() => {
          setOpenRevertStaffToStudentDialogue(false);
          setSelectedStaff(null);
        }}
        refetchStaff={refetchStaff}
      />
    </div>
  );
}
