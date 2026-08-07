import Link from "next/link";
import { Building2, MapPin, Users, ArrowRight } from "lucide-react";
import type { ExternalSchool } from "@/lib/externalSchoolSearch";

// Supplementary results from free, live school-directory APIs (Hipolabs'
// global university list + the US Dept. of Education's College Scorecard),
// shown alongside our own curated `programs` listings so a search doesn't
// come up empty just because a school isn't in our database yet. These are
// intentionally a distinct, lighter-weight tier: we don't have confirmed
// tuition, fees, or an application relationship with these schools the way
// we do for the programs above, so there's no direct link to school websites --
// just a pointer to book a consultation to discuss these options.
export default function ExternalSchoolResults({
  schools,
  isPreview = false,
}: {
  schools: ExternalSchool[];
  // True when this is showing an unprompted example set (no search or
  // destination filter active yet) rather than results matching a query.
  isPreview?: boolean;
}) {
  if (schools.length === 0) return null;

  return (
    <div className="mt-12 space-y-6 border-t border-[#e0e0e0] pt-12">
      <div>
        <h2 className="text-2xl font-semibold text-black">
          {isPreview
            ? "Explore More Schools Worldwide"
            : "Other Schools Worldwide"}
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          {isPreview ? (
            <>
              A live preview from global university directories, beyond our{" "}
              <strong className="text-black">curated program catalog</strong>{" "}
              above. Search by school name or destination to find a specific
              institution.
            </>
          ) : (
            <>
              Pulled from global university directories. Our team can help you
              explore these schools and navigate the application process.
            </>
          )}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {schools.map((school) => (
          <div
            key={`${school.name}-${school.country}`}
            className="group rounded-2xl border border-[#e0e0e0] bg-gradient-to-br from-white to-[#fafafa] p-6 transition-all duration-300 hover:border-primary-300/30 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary-300/10">
                <Building2 className="size-5 text-primary-300" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 font-semibold text-black">
                  {school.name}
                </h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-neutral-500">
                  <MapPin className="size-4 shrink-0" />
                  <span className="line-clamp-1">
                    {[school.city, school.state, school.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </p>
                {school.studentSize && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-neutral-500">
                    <Users className="size-4 shrink-0" />
                    {school.studentSize.toLocaleString()} students
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-primary-300/5 to-primary-300/10 p-6 sm:p-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold text-black">
              Interested in any of these schools?
            </h3>
            <p className="mt-1 text-sm text-neutral-600">
              Our team can help you explore options and guide you through the
              application process.
            </p>
          </div>
          <Link
            href="/#consultation-form"
            prefetch={false}
            className="group/btn inline-flex items-center gap-2 whitespace-nowrap rounded-2xl bg-primary-300 px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary-300/30"
          >
            Book a Consultation
            <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
