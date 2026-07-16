"use client";

import UsersSearchForm, {
  type SearchField,
} from "@/components/admin-dashboard/dashboard/UsersSearchForm";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useErrorToast } from "../toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { WifiOff } from "lucide-react";
import StaffTable from "./StaffTable";

type StaffListResponse = {
  staff: Array<{
    id: string;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    email: string;
    phone: string | null;
  }>;
  count: number;
};

async function getPaginatedStaff(params: {
  page: number;
  staffPerPage: number;
  staffAscending: boolean;
  searchField: SearchField | null;
  searchQuery: string | null;
}): Promise<StaffListResponse> {
  const query = new URLSearchParams({
    page: `${params.page}`,
    staffPerPage: `${params.staffPerPage}`,
    ascending: `${params.staffAscending}`,
  });

  if (params.searchField) query.set("searchField", params.searchField);
  if (params.searchQuery) query.set("searchQuery", params.searchQuery);

  const res = await fetch(
    `/api/admin-dashboard/staff-management/staff?${query.toString()}`,
  );
  const payload = await res.json();

  if (!res.ok || !payload.success) {
    throw new Error(payload.error || "Failed to fetch staff list");
  }

  return payload.data;
}

export default function StaffManagementView() {
  const [page, setPage] = useState(1);
  const [staffPerPage, setStaffPerPage] = useState(20);
  const [staffAscending, setStaffAscending] = useState(false);
  const [searchField, setSearchField] = useState<SearchField | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [decoupledSearchField, setDecoupledSearchField] =
    useState<SearchField>("email");
  const [decoupledSearchQuery, setDecoupledSearchQuery] = useState("");

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: [
      "staff-management-view-staff-list",
      page,
      staffPerPage,
      staffAscending,
      searchField,
      searchQuery,
    ],
    queryFn: () =>
      getPaginatedStaff({
        page,
        staffPerPage,
        staffAscending,
        searchField,
        searchQuery,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
  });

  const staff = data?.staff || [];
  const totalStaff = data?.count || 0;

  useErrorToast({
    description: "An error occured while loading table data",
    refetch,
    error,
  });

  return (
    <div className="px-6 md:px-8">
      <section>
        <header className="mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-center lg:gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-primary xs:text-nowrap">
              Order by:
            </span>
            <Select
              value={String(staffAscending)}
              onValueChange={(value) => {
                // check online status
                if (!navigator.onLine) {
                  toast.warning("You are offline", {
                    position: "top-center",
                    icon: <WifiOff className="size-5" />,
                  });
                } else {
                  setPage(1);
                  setStaffAscending(value === "true");
                  setSearchField(null);
                  setSearchQuery(null);
                  setDecoupledSearchQuery("");
                }
              }}
            >
              <SelectTrigger
                className="grow rounded-md border-none bg-white focus-visible:border-primary-300 focus-visible:ring-primary-300"
                chevronClassName="opacity-100"
              >
                <SelectValue placeholder="Order staff by:" />
              </SelectTrigger>
              <SelectContent className="p-2" align="end">
                <SelectItem value="false" className="focus:bg-primary-300/10">
                  Newest to Oldest
                </SelectItem>
                <SelectItem value="true" className="focus:bg-primary-300/10">
                  Oldest to Newest
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <UsersSearchForm
            role="staff"
            setSearchField={setSearchField}
            setSearchQuery={setSearchQuery}
            decoupledSearchField={decoupledSearchField}
            decoupledSearchQuery={decoupledSearchQuery}
            setDecoupledSearchField={setDecoupledSearchField}
            setDecoupledSearchQuery={setDecoupledSearchQuery}
          />
        </header>

        {/* Search results indicator */}
        {searchField && searchQuery && !isFetching && (
          <p className="mb-1 font-semibold text-primary-300">
            Search results for{" "}
            <span className="font-black">
              {`(${searchField === "id" ? "Staff ID" : searchField.replace(/_/g, " ")}): ${searchQuery}`}
            </span>
          </p>
        )}

        <StaffTable
          staff={staff ?? []}
          loading={isFetching}
          page={page}
          setPage={setPage}
          staffPerPage={staffPerPage}
          setStaffPerPage={setStaffPerPage}
          totalStaff={totalStaff}
          refetchStaff={refetch}
        />
      </section>
    </div>
  );
}
