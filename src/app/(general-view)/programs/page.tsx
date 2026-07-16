import { ChevronDown } from "lucide-react";
import ProgramCard from "@/components/ProgramCard";
import ProgramsFilterForm from "@/components/forms/ProgramsFilterForm";

const programs = [
  {
    image:
      "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754939752/gramel/public/programs-school-image_yv0drx.jpg",
    university: "University Name This is a Long Name",
    programType: "Postgraduate Diploma",
    programTitle: "Post-Baccalaureate Diploma - Law Enforcement Studies",
    location: "Ontario, Canada",
    campusCity: "Windsor, Canada",
    tuition: "$13,640 CAD",
    applicationFee: "$125 CAD",
    duration: "24 months (2 years)",
    intakes: [
      { date: "Sept 2026", rate: "Very High" },
      { date: "Jan 2027", rate: "High" },
      { date: "May 2027", rate: "Very High" },
    ],
  },
  {
    image:
      "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754939752/gramel/public/programs-school-image_yv0drx.jpg",
    university: "Another University Name",
    programType: "Masters",
    programTitle: "MSc Computer Science",
    location: "Alberta, Canada",
    campusCity: "Calgary, Canada",
    tuition: "$18,000 CAD",
    applicationFee: "$150 CAD",
    duration: "12 months (1 year)",
    intakes: [
      { date: "Sept 2026", rate: "High" },
      { date: "Jan 2027", rate: "Medium" },
      { date: "May 2027", rate: "High" },
    ],
  },
];

export default async function ProgramsPage() {
  return (
    <main className="pt-14">
      <section className="mx-auto max-w-screen-2xl px-6 md:px-12">
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-9">
          {/* Programs container */}
          <div className="order-2 min-w-full lg:order-1">
            {/* Heading container */}
            <div className="flex items-center justify-between py-3 max-sm:text-sm">
              <p className="text-black">
                Results 1 - 10 <br className="sm:hidden" />
                (out of 142 programs)
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
            <div className="mt-6 space-y-6">
              {programs.map((program, idx) => (
                <ProgramCard key={idx} {...program} />
              ))}
            </div>
          </div>

          {/* Filters */}
          <ProgramsFilterForm />
        </div>
      </section>
    </main>
  );
}
