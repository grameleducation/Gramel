import { Building2, MapPin, Users } from "lucide-react";
import type { ExternalSchool } from "@/lib/externalSchoolSearch";

// Supplementary results from free, live school-directory APIs (Hipolabs'
// global university list + the US Dept. of Education's College Scorecard),
// shown alongside our own curated `programs` listings so a search doesn't
// come up empty just because a school isn't in our database yet.
export default function ExternalSchoolResults({
  schools,
}: {
  schools: ExternalSchool[];
}) {
  if (schools.length === 0) return null;

  return (
    <div className="mt-10 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-black">
          More Schools Matching Your Search
        </h2>
        <p className="text-sm text-neutral-400">
          Pulled live from public university directories -- not yet in our
          program database. Book a consultation to ask about applying here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {schools.map((school) => (
          <div
            key={`${school.name}-${school.country}`}
            className="rounded-2xl border border-[#e0e0e0] bg-white p-5"
          >
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 size-5 shrink-0 text-primary-300" />
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-black">
                  {school.name}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-400">
                  <MapPin className="size-3.5 shrink-0" />
                  {[school.city, school.state, school.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {school.studentSize && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-400">
                    <Users className="size-3.5 shrink-0" />
                    {school.studentSize.toLocaleString()} students
                  </p>
                )}
                {school.website && (
                  <a
                    href={
                      school.website.startsWith("http")
                        ? school.website
                        : `https://${school.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-primary-300 hover:underline"
                  >
                    Visit website
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
