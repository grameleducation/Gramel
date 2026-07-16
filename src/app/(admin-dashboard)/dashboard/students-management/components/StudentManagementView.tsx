"use client";

import RegisteredStudentsTable from "./RegisteredStudentsTable";
import UsersSearchForm, {
  SearchField,
} from "@/components/admin-dashboard/dashboard/UsersSearchForm";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useErrorToast } from "../../toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { WifiOff } from "lucide-react";
import { UserRoles } from "@/lib/permissions/role";

type StudentsListResponse = {
  students: Array<{
    id: string;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    email: string;
    phone: string;
  }>;
  count: number;
};

async function getPaginatedStudents(params: {
  page: number;
  studentsPerPage: number;
  studentsAscending: boolean;
  searchField: SearchField | null;
  searchQuery: string | null;
  staffRole: UserRoles;
  staffId: string;
  adminStudentsFilter: "all" | "my" | "unassigned";
}): Promise<StudentsListResponse> {
  const query = new URLSearchParams({
    page: `${params.page}`,
    studentsPerPage: `${params.studentsPerPage}`,
    ascending: `${params.studentsAscending}`,
    staffRole: params.staffRole,
    staffId: params.staffId,
    adminStudentsFilter: params.adminStudentsFilter,
    source: "students-management",
  });

  if (params.searchField) query.set("searchField", params.searchField);
  if (params.searchQuery) query.set("searchQuery", params.searchQuery);

  const res = await fetch(
    `/api/admin-dashboard/students-management/students?${query.toString()}`,
  );
  const payload = await res.json();

  if (!res.ok || !payload.success) {
    throw new Error(payload.error || "Failed to fetch students");
  }

  return payload.data;
}

export default function StudentsManagementView({
  user,
}: {
  user: {
    id: string;
    user_role: UserRoles;
  };
}) {
  const [page, setPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(20);
  const [studentsAscending, setStudentsAscending] = useState(false);
  const [searchField, setSearchField] = useState<SearchField | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [decoupledSearchField, setDecoupledSearchField] =
    useState<SearchField>("email");
  const [decoupledSearchQuery, setDecoupledSearchQuery] = useState("");
  const [adminStudentsFilter, setAdminStudentsFilter] = useState<
    "all" | "my" | "unassigned" //  students
  >("all");

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: [
      "students-management-view-students-list",
      page,
      studentsPerPage,
      studentsAscending,
      searchField,
      searchQuery,
      user.user_role,
      user.id,
      adminStudentsFilter,
    ],
    queryFn: () =>
      getPaginatedStudents({
        page,
        studentsPerPage,
        studentsAscending,
        searchField,
        searchQuery,
        staffRole: user.user_role,
        staffId: user.id,
        adminStudentsFilter,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
  });

  useErrorToast({
    description: "An error occured while loading table data",
    refetch,
    error,
  });

  const students = data?.students || [];
  const totalStudents = data?.count || 0;

  return (
    <div className="px-6 md:px-8">
      <h1 className="mb-10 text-center text-lg font-bold text-primary uppercase md:text-2xl">
        {user.user_role === UserRoles.admin
          ? adminStudentsFilter + " STUDENTS"
          : "YOUR ASSIGNED STUDENTS"}
      </h1>

      <section>
        <header className="mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-center lg:gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-primary xs:text-nowrap">
              Order by:
            </span>
            <Select
              value={String(studentsAscending)}
              onValueChange={(value) => {
                // check online status
                if (!navigator.onLine) {
                  toast.warning("You are offline", {
                    position: "top-center",
                    icon: <WifiOff className="size-5" />,
                  });
                } else {
                  setPage(1);
                  setStudentsAscending(value === "true");
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
                <SelectValue placeholder="Order students by:" />
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
            role="student"
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
              {`(${searchField === "id" ? "Student ID" : searchField.replace(/_/g, " ")}): ${searchQuery}`}
            </span>
          </p>
        )}

        <RegisteredStudentsTable
          students={students ?? []}
          loading={isFetching}
          page={page}
          setPage={setPage}
          studentsPerPage={studentsPerPage}
          adminStudentsFilter={adminStudentsFilter}
          showAdminAllStudentsToggle
          setAdminStudentsFilter={setAdminStudentsFilter}
          setStudentsPerPage={setStudentsPerPage}
          totalStudents={totalStudents}
          userRole={user.user_role}
          refetchStudents={refetch}
        />
      </section>
    </div>
  );
}
