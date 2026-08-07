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
      className="order-1 min-w-full space-y-5 pb-6 lg:order-2 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:rounded-2xl lg:bg-white lg:p-7 lg:shadow-sm"
    >
      <div>
        <h3 className="text-2xl font-bold text-black">
          Find Your Program
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Search and filter from 1,500+ programs worldwide
        </p>
      </div>

      <input
        type="text"
        name="search"
        defaultValue={defaultValues.search}
        placeholder="What would you like to study?"
        className="block w-full rounded-xl border border-neutral-200 bg-white p-3.5 text-sm text-neutral-700 shadow-sm transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300 focus:border-primary-300 focus:ring-2 focus:ring-primary-300/20 focus:outline-none"
      />

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-neutral-900">Quick Destinations</h4>

        <QuickLocationButtons
          countryInputId="programs-filter-country"
          activeCountry={defaultValues.country}
        />
      </div>
      <div className="border-t border-neutral-100" />

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

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <SearchableSelect
            name="program_type"
            defaultValue={defaultValues.program_type}
            options={filterOptions.programTypes}
            placeholder="Program Type"
          />
          <SearchableSelect
            name="field_of_study"
            defaultValue={defaultValues.field_of_study}
            options={filterOptions.fieldsOfStudy}
            placeholder="Field of Study"
          />
        </div>
      </div>

      <div className="border-t border-neutral-100" />

      <SubmitButton
        isPending={false}
        pendingText="Searching..."
        defaultText="Search Programs"
        className="w-full"
      />
    </form>
  );
}
