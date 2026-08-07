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
            <div className="mb-6 rounded-2xl bg-gradient-to-r from-primary-300/5 to-primary-300/10 p-4 sm:p-6">
              <p className="text-sm text-neutral-600 max-sm:text-xs">
                Our <strong className="text-black">curated program catalog</strong> features
                confirmed tuition, fees, and intake dates. Search by school
                name or destination to explore more universities worldwide.
              </p>
            </div>

            {/* Heading container */}
            <div className="flex flex-col items-start justify-between gap-4 py-4 sm:flex-row sm:items-center max-sm:text-sm">
              <p className="font-medium text-black">
                {total === 0
                  ? "No programs found"
                  : `Showing ${programs.length}`}
                {total > 0 && <span className="text-neutral-500"> of {total} program{total === 1 ? "" : "s"}</span>}
              </p>

              {/* sort container */}
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-medium text-neutral-600">Sort by:</span>
                <button className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-black transition-all duration-300 hover:border-primary-300 hover:bg-primary-300/5 max-sm:text-xs sm:px-4">
                  Newest
                  <ChevronDown className="size-4 shrink-0" />
                </button>
              </div>
            </div>

            {/* programs list */}
            {programs.length === 0 ? (
              <div className="mt-8 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center sm:px-8">
                <div className="mb-3 flex justify-center">
                  <div className="rounded-full bg-neutral-100 p-3">
                    <ChevronDown className="size-6 text-neutral-300" />
                  </div>
                </div>
                <p className="text-lg font-medium text-neutral-700">
                  No programs match your filters
                </p>
                <p className="mt-2 text-sm text-neutral-500">
                  Try adjusting your search criteria or exploring our full catalog below.
                </p>
                {filters.search && externalSchools.length === 0 && (
                  <p className="mx-auto mt-4 max-w-md text-sm text-neutral-500">
                    💡 <strong>&quot;{filters.search}&quot;</strong> looks like a subject.
                    Try searching an institution name instead (e.g. <strong>&quot;University of Toronto&quot;</strong>) to find more results.
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-8 space-y-5">
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
