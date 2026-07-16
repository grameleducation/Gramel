"use client";

import QuickLocationButtons from "../programpage/QuickLocationButtons";
import { NewFormInput } from "./FormInput";
import SearchableSelect from "./SearchableSelect";
import SubmitButton from "./SubmitButton";

const options = {
  countries: [
    "Canada",
    "united States",
    "Germany",
    "Australia",
    "Ireland",
    "New Zealand",
  ],
  universities: ["Harvard", "MIT", "University of Lagos", "Oxford", "Toronto"],
  programs: ["Engineering", "Medicine", "Law", "Business", "Art"],
  filed_of_study: ["Electrical Engineering", "Bio-Chemistry"],
  institution_type: ["University"],
};
export default function ProgramsFilterForm() {
  return (
    <form className="order-1 min-w-full space-y-4 pb-6 lg:order-2 lg:p-6">
      <h3 className="rounded-[0.625rem] bg-primary p-4 text-2xl font-semibold text-white">
        Filter
      </h3>

      {/* <NewFormInput
        type="search"
        name="search"
        label=""
        placeholder="What would you like to study?"
      /> */}

      <div className="space-y-2.5">
        <h4 className="font-semibold text-black">Quick Location</h4>

        <QuickLocationButtons />
      </div>
      <hr className="bg-[#7F7F7F]" />

      <div className="space-y-4">
        <SearchableSelect
          options={options.countries}
          placeholder="Destination"
        />
        <SearchableSelect
          options={options.institution_type}
          placeholder="Institution Type"
        />
        <SearchableSelect
          options={options.universities}
          placeholder="Institution"
        />

        <div className="flex flex-col gap-4 sm:flex-row lg:flex-col xl:flex-row">
          <SearchableSelect options={options.programs} placeholder="Program" />
          <SearchableSelect
            options={options.filed_of_study}
            placeholder="Field of Study"
          />
        </div>
      </div>

      <hr className="bg-[#7F7F7F]" />

      <SubmitButton
        isPending={false}
        pendingText="Searching..."
        defaultText="Search"
        className="px-6 xl:w-max"
      />
    </form>
  );
}
