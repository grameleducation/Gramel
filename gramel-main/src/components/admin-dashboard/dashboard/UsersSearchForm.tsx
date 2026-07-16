"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import z from "zod";
import { toast } from "sonner";
import { WifiOff } from "lucide-react";
import { capitalize } from "lodash";
import { searchFieldSchema } from "@/lib/zodSchemas";

export type SearchField = z.infer<typeof searchFieldSchema>;

export default function UsersSearchForm({
  role,
  setSearchField,
  setSearchQuery,
  decoupledSearchField,
  decoupledSearchQuery,
  setDecoupledSearchField,
  setDecoupledSearchQuery,
}: {
  role: "student" | "staff";
  setSearchField: React.Dispatch<React.SetStateAction<SearchField | null>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string | null>>;
  decoupledSearchField: SearchField;
  decoupledSearchQuery: string;
  setDecoupledSearchField: React.Dispatch<React.SetStateAction<SearchField>>;
  setDecoupledSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="text-sm font-bold text-nowrap text-primary">
        Search for {role} by:
      </span>

      {/* Search form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!decoupledSearchQuery) {
            setSearchField(null);
            setSearchQuery(null);
          } else if (!navigator.onLine) {
            // check online status
            toast.warning("You are offline", {
              position: "top-center",
              icon: <WifiOff className="size-5" />,
            });
          } else {
            setSearchQuery(decoupledSearchQuery);
            setSearchField(decoupledSearchField);
          }
        }}
        className="group flex grow flex-col gap-2 sm:flex-row"
      >
        {/* Inputs container */}
        <div className="flex grow rounded-md border border-gray-100 bg-white shadow duration-200 group-has-[input:focus]:ring-3 group-has-[input:focus]:ring-primary-300">
          <Select
            value={decoupledSearchField}
            onValueChange={(value) => {
              const result = searchFieldSchema.safeParse(value);
              if (!result.success) return toast.error("Invalid search field");
              setSearchField(null);
              setSearchQuery(null);
              setDecoupledSearchQuery("");
              setDecoupledSearchField(result.data);
            }}
          >
            <SelectTrigger
              className="cursor-pointer rounded-none rounded-l-md border-none bg-transparent shadow-none focus-visible:border-primary-300 focus-visible:ring-primary-300"
              chevronClassName="opacity-100"
            >
              <SelectValue placeholder="Select a field" />
            </SelectTrigger>
            <SelectContent className="p-2" align="end">
              <SelectItem value="email" className="focus:bg-primary-300/10">
                Email
              </SelectItem>
              <SelectItem value="phone" className="focus:bg-primary-300/10">
                Phone
              </SelectItem>
              <SelectItem value="id" className="focus:bg-primary-300/10">
                {capitalize(role)} ID
              </SelectItem>
              <SelectItem
                value="first_name"
                className="focus:bg-primary-300/10"
              >
                First Name
              </SelectItem>
              <SelectItem
                value="middle_name"
                className="focus:bg-primary-300/10"
              >
                Middle Name
              </SelectItem>
              <SelectItem value="last_name" className="focus:bg-primary-300/10">
                Last Name
              </SelectItem>
            </SelectContent>
          </Select>
          {/* Vertical separator */}
          <div className="border-r border-gray-300"></div>
          <Input
            type="search"
            value={decoupledSearchQuery}
            onChange={(e) => {
              setDecoupledSearchQuery(e.target.value);
              if (e.target.value.trim() === "") {
                // reset table data when search query is cleared
                setSearchField(null);
                setSearchQuery(null);
              }
            }}
            placeholder={`Enter ${role}'s ${decoupledSearchField === "id" ? "ID" : decoupledSearchField.replace(/_/g, " ")}`}
            className="peer grow rounded-none rounded-r-md border-none bg-transparent p-4 text-neutral-500 shadow-none placeholder:text-sm placeholder:text-[#626060] focus:outline-none focus-visible:ring-primary-300 xl:min-w-80"
          />
        </div>

        <Button
          type="submit"
          className="h-auto hover:bg-primary-300 active:bg-primary"
        >
          Search
        </Button>
      </form>
    </div>
  );
}
