import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import ProgramCard from "@/components/ProgramCard";
import ProgramsFilterForm, {
  ProgramsFilterOptions,
  ProgramsFilterValues,
} from "@/components/forms/ProgramsFilterForm";
import ExternalSchoolResults from "@/components/programpage/ExternalSchoolResults";
import {
  previewExternalSchools,
  searchExternalSchools,
} from "@/lib/externalSchoolSearch";
import pool from "@/utils/db";
import tryCatch from "@/utils/tryCatch";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Search 1,500+ university programs worldwide with Gramel Education, Nigeria's trusted study abroad agency in Abuja. Filter by country, field of study, and program type.",
};

const RESULTS_LIMIT = 20;

interface ProgramRow {
  id: number;
  university: string;
  institution_type: string;
  country: string;
  campus_city: string;
  program_type: string;
  program_title: string;
  field_of_study: string;
  tuition_amount: string;
  tuition_currency: string;
  application_fee_amount: string;
  application_fee_currency: string;
  duration_months: number;
  image_url: string;
  intakes: { date: string; rate: string }[];
  total_count: string;
}

interface FilterOptionsRow {
  countries: string[] | null;
  institution_types: string[] | null;
  universities: string[] | null;
  program_types: string[] | null;
  fields_of_study: string[] | null;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  CAD: "$",
  USD: "$",
  AUD: "$",
  GBP: "£",
  EUR: "€",
};

function formatMoney(amount: string, currency: string) {
  const symbol = CURRENCY_SYMBOLS[currency] ?? "";
  const value = Math.round(Number(amount)).toLocaleString();
  return `${symbol}${value} ${currency}`;
}

function formatDuration(months: number) {
  if (months % 12 === 0) {
    const years = months / 12;
    return `${months} months (${years} year${years > 1 ? "s" : ""})`;
  }
  return `${months} months`;
}

async function fetchFilterOptions(): Promise<ProgramsFilterOptions> {
  const [result, error] = await tryCatch(() =>
    pool.query<FilterOptionsRow>(`
      SELECT
        (SELECT array_agg(DISTINCT country ORDER BY country) FROM public.programs) AS countries,
        (SELECT array_agg(DISTINCT institution_type ORDER BY institution_type) FROM public.programs) AS institution_types,
        (SELECT array_agg(DISTINCT university ORDER BY university) FROM public.programs) AS universities,
        (SELECT array_agg(DISTINCT program_type ORDER BY program_type) FROM public.programs) AS program_types,
        (SELECT array_agg(DISTINCT field_of_study ORDER BY field_of_study) FROM public.programs) AS fields_of_study
    `),
  );

  if (error || !result.rows[0]) {
    return {
      countries: [],
      institutionTypes: [],
      universities: [],
      programTypes: [],
      fieldsOfStudy: [],
    };
  }

  const row = result.rows[0];
  return {
    countries: row.countries ?? [],
    institutionTypes: row.institution_types ?? [],
    universities: row.universities ?? [],
    programTypes: row.program_types ?? [],
    fieldsOfStudy: row.fields_of_study ?? [],
  };
}

async function fetchPrograms(filters: ProgramsFilterValues) {
  const whereConditions: string[] = [];
  const queryParams: string[] = [];
  let paramIndex = 1;

  const filterColumns: [keyof ProgramsFilterValues, string][] = [
    ["country", "country"],
    ["institution_type", "institution_type"],
    ["university", "university"],
    ["program_type", "program_type"],
    ["field_of_study", "field_of_study"],
  ];

  for (const [filterKey, column] of filterColumns) {
    const value = filters[filterKey];
    if (value) {
      whereConditions.push(`LOWER(${column}) = LOWER($${paramIndex})`);
      queryParams.push(value);
      paramIndex++;
    }
  }

  if (filters.search) {
    whereConditions.push(
      `(program_title ILIKE $${paramIndex} OR field_of_study ILIKE $${paramIndex} OR university ILIKE $${paramIndex})`,
    );
    queryParams.push(`%${filters.search}%`);
    paramIndex++;
  }

  const whereClause =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const [result, error] = await tryCatch(() =>
    pool.query<ProgramRow>(
      `SELECT id, university, institution_type, country, campus_city, program_type,
              program_title, field_of_study, tuition_amount, tuition_currency,
              application_fee_amount, application_fee_currency, duration_months,
              image_url, intakes, COUNT(*) OVER() AS total_count
       FROM public.programs
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ${RESULTS_LIMIT}`,
      queryParams,
    ),
  );

  if (error) return { programs: [] as ProgramRow[], total: 0 };

  const total =
    result.rows.length > 0 ? parseInt(result.rows[0].total_count, 10) : 0;
  return { programs: result.rows, total };
}

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const filters: ProgramsFilterValues = {
    search: params.search || undefined,
    country: params.country || undefined,
    institution_type: params.institution_type || undefined,
    university: params.university || undefined,
    program_type: params.program_type || undefined,
    field_of_study: params.field_of_study || undefined,
  };

  const hasSchoolFilter = !!(filters.search || filters.country);

  const [filterOptions, { programs, total }, externalSchools] =
    await Promise.all([
      fetchFilterOptions(),
      fetchPrograms(filters),
      hasSchoolFilter
        ? searchExternalSchools(filters.search, filters.country)
        : previewExternalSchools(),
    ]);

  return (
    <main className="pt-14">
      <section className="mx-auto max-w-screen-2xl px-6 md:px-12">
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-9">
          {/* Programs container */}
          <div className="order-2 min-w-full lg:order-1">
            <p className="pt-3 text-sm text-neutral-400 max-sm:text-xs">
              Below is our curated program catalog, with confirmed tuition,
              fees, and intake dates. Search by school name or destination to
              also pull in more universities worldwide, even ones not yet in
              our catalog.
            </p>

            {/* Heading container */}
            <div className="flex items-center justify-between py-3 max-sm:text-sm">
              <p className="text-black">
                {total === 0
                  ? "No programs found"
                  : `Results 1 - ${programs.length}`}
                <br className="sm:hidden" />
                {total > 0 && ` (out of ${total} program${total === 1 ? "" : "s"})`}
              </p>

              {/* sort container */}
              <div className="flex items-center gap-3">
                <span className="font-semibold">Sort</span>
                <button className="flex items-center gap-2.5 rounded-2xl border border-black p-[0.875rem] px-3 duration-300 hover:border-neutral-300 hover:text-neutral-300 sm:px-4">
                  Default
                  <ChevronDown className="shrink-0 text-xl" />
                </button>
              </div>
            </div>

            {/* programs list */}
            {programs.length === 0 ? (
              <div className="mt-6 rounded-3xl border-2 border-dashed border-[#e0e0e0] bg-[#f9f9f9] py-16 text-center">
                <p className="text-lg text-neutral-300">
                  No programs match your filters.
                </p>
                <p className="mt-2 text-sm text-neutral-300">
                  Try adjusting or clearing your search criteria.
                </p>
                {filters.search && externalSchools.length === 0 && (
                  <p className="mx-auto mt-4 max-w-md text-sm text-neutral-400">
                    Tip: &quot;{filters.search}&quot; looks like a subject
                    rather than a school name. Try searching an institution
                    name instead (e.g. &quot;University of Toronto&quot;) to
                    pull in live results from global school directories.
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                {programs.map((program) => (
                  <ProgramCard
                    key={program.id}
                    image={program.image_url}
                    university={program.university}
                    programType={program.program_type}
                    programTitle={program.program_title}
                    location={program.country}
                    campusCity={`${program.campus_city}, ${program.country}`}
                    tuition={formatMoney(
                      program.tuition_amount,
                      program.tuition_currency,
                    )}
                    applicationFee={formatMoney(
                      program.application_fee_amount,
                      program.application_fee_currency,
                    )}
                    duration={formatDuration(program.duration_months)}
                    intakes={program.intakes}
                  />
                ))}
              </div>
            )}

            <ExternalSchoolResults
              schools={externalSchools}
              isPreview={!hasSchoolFilter}
            />
          </div>

          {/* Filters */}
          <ProgramsFilterForm
            filterOptions={filterOptions}
            defaultValues={filters}
          />
        </div>
      </section>
    </main>
  );
}
