import "server-only";

import server_env from "@/utils/env.server";
import tryCatch from "@/utils/tryCatch";

export interface ExternalSchool {
  name: string;
  country: string;
  website?: string;
  city?: string;
  state?: string;
  studentSize?: number;
  source: "hipolabs" | "scorecard" | "both";
}

const FETCH_TIMEOUT_MS = 5000;
const RESULTS_PER_SOURCE = 12;

interface HipolabsUniversity {
  name: string;
  country: string;
  web_pages?: string[];
}

async function fetchHipolabsSchools(
  name?: string,
  country?: string,
): Promise<ExternalSchool[]> {
  if (!name && !country) return [];

  const params = new URLSearchParams();
  if (name) params.set("name", name);
  if (country) params.set("country", country);

  const [res, error] = await tryCatch(() =>
    fetch(`http://universities.hipolabs.com/search?${params}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: 3600 },
    }),
  );
  if (error || !res.ok) return [];

  const [data, parseError] = await tryCatch(
    () => res.json() as Promise<HipolabsUniversity[]>,
  );
  if (parseError || !Array.isArray(data)) return [];

  return data.slice(0, RESULTS_PER_SOURCE).map((u) => ({
    name: u.name,
    country: u.country,
    website: u.web_pages?.[0],
    source: "hipolabs" as const,
  }));
}

interface ScorecardResult {
  "school.name": string;
  "school.city"?: string;
  "school.state"?: string;
  "school.school_url"?: string;
  "latest.student.size"?: number;
}

// College Scorecard only covers US institutions, so this is skipped whenever
// a non-US destination filter is active.
async function fetchScorecardSchools(name?: string): Promise<ExternalSchool[]> {
  if (!name) return [];

  const params = new URLSearchParams({
    "school.name": name,
    fields:
      "school.name,school.city,school.state,school.school_url,latest.student.size",
    per_page: String(RESULTS_PER_SOURCE),
    api_key: server_env.COLLEGE_SCORECARD_API_KEY || "DEMO_KEY",
  });

  const [res, error] = await tryCatch(() =>
    fetch(`https://api.data.gov/ed/collegescorecard/v1/schools?${params}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: 3600 },
    }),
  );
  if (error || !res.ok) return [];

  const [data, parseError] = await tryCatch(
    () => res.json() as Promise<{ results: ScorecardResult[] }>,
  );
  if (parseError || !Array.isArray(data.results)) return [];

  // Scorecard's school.name filter does a fuzzy/tokenized match, not a
  // substring match -- searching "Computer Science" can return something
  // like "Regis University" with no obvious connection to the query. Only
  // keep results that actually contain the search term, so a subject/field
  // search (which this section isn't built to handle) correctly yields no
  // external results instead of a confusing unrelated school.
  const lowerName = name.toLowerCase();
  const relevantResults = data.results.filter((r) =>
    r["school.name"]?.toLowerCase().includes(lowerName),
  );

  return relevantResults.map((r) => ({
    name: r["school.name"],
    country: "United States",
    website: r["school.school_url"],
    city: r["school.city"],
    state: r["school.state"],
    studentSize: r["latest.student.size"],
    source: "scorecard" as const,
  }));
}

// Combines the free Hipolabs university directory (broad, global, name/domain
// only) with the free College Scorecard API (US-only, but richer -- city,
// state, enrollment) to supplement the curated `programs` table with live
// results for schools that aren't in our own database yet.
export async function searchExternalSchools(
  name?: string,
  country?: string,
): Promise<ExternalSchool[]> {
  if (!name && !country) return [];

  const isUSRelevant =
    !country || country.toLowerCase().includes("united states");

  const [hipolabs, scorecard] = await Promise.all([
    fetchHipolabsSchools(name, country),
    isUSRelevant ? fetchScorecardSchools(name) : Promise.resolve([]),
  ]);

  const byName = new Map<string, ExternalSchool>();
  for (const school of hipolabs) {
    byName.set(school.name.toLowerCase(), school);
  }
  for (const school of scorecard) {
    const key = school.name.toLowerCase();
    const existing = byName.get(key);
    byName.set(
      key,
      existing ? { ...existing, ...school, source: "both" } : school,
    );
  }

  return Array.from(byName.values()).slice(0, RESULTS_PER_SOURCE);
}

// Countries shown as a preview on /programs when no search or destination
// filter is active, so the live Hipolabs/Scorecard integration is visible
// without requiring a visitor to already know to search an institution name.
const PREVIEW_COUNTRIES = ["United States", "United Kingdom", "Canada"];
const PREVIEW_PER_COUNTRY = 2;

export async function previewExternalSchools(): Promise<ExternalSchool[]> {
  const results = await Promise.all(
    PREVIEW_COUNTRIES.map((country) => fetchHipolabsSchools(undefined, country)),
  );

  // Cap each country's contribution before flattening, so the preview is an
  // actual mix across destinations rather than just the first country's
  // results filling the whole slice.
  return results.flatMap((schools) => schools.slice(0, PREVIEW_PER_COUNTRY));
}
