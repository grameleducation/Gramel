"use client";

import QuickLocationButtons from "../programpage/QuickLocationButtons";
import SearchableSelect from "./SearchableSelect";
import SubmitButton from "./SubmitButton";

export interface ProgramsFilterOptions {
  countries: string[];
  institutionTypes: string[];
  universities: string[];
  programTypes: string[];
  fieldsOfStudy: string[];
}

export interface ProgramsFilterValues {
  search?: string;
  country?: string;
  institution_type?: string;
  university?: string;
  program_type?: string;
  field_of_study?: string;
}

export default function ProgramsFilterForm({
  filterOptions,
  defaultValues,
}: {
  filterOptions: ProgramsFilterOptions;
  defaultValues: ProgramsFilterValues;
}) {
  return (
    <form
      action="/programs"
      method="get"
      className="order-1 min-w-full space-y-4 pb-6 lg:order-2 lg:p-6"
    >
      <h3 className="rounded-[0.625rem] bg-primary p-4 text-2xl font-semibold text-white">
        Filter
      </h3>

      <input
        type="text"
        name="search"
        defaultValue={defaultValues.search}
        placeholder="What would you like to study?"
        className="block w-full rounded-xl border border-transparent bg-[#EFEFEF] p-4 text-neutral-500 shadow-sm transition-all duration-200 placeholder:text-sm placeholder:text-[#626060] hover:ring-3 hover:ring-[#62A9DC]/50 focus:ring-3 focus:ring-[#62A9DC] focus:outline-none"
      />

      <div className="space-y-2.5">
        <h4 className="font-semibold text-black">Quick Location</h4>

        <QuickLocationButtons
          countryInputId="programs-filter-country"
          activeCountry={defaultValues.country}
        />
      </div>
      <hr className="bg-[#7F7F7F]" />

      <div className="space-y-4">
        <SearchableSelect
          id="programs-filter-country"
          name="country"
          defaultValue={defaultValues.country}
          options={filterOptions.countries}
          placeholder="Destination"
        />
        <SearchableSelect
          name="institution_type"
          defaultValue={defaultValues.institution_type}
          options={filterOptions.institutionTypes}
          placeholder="Institution Type"
        />
        <SearchableSelect
          name="university"
          defaultValue={defaultValues.university}
          options={filterOptions.universities}
          placeholder="Institution"
        />

        <div className="flex flex-col gap-4 sm:flex-row lg:flex-col xl:flex-row">
          <SearchableSelect
            name="program_type"
            defaultValue={defaultValues.program_type}
            options={filterOptions.programTypes}
            placeholder="Program"
          />
          <SearchableSelect
            name="field_of_study"
            defaultValue={defaultValues.field_of_study}
            options={filterOptions.fieldsOfStudy}
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
