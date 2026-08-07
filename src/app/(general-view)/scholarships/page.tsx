import Image from "next/image";
import type { Metadata } from "next";
import ScholarshipSearchSection from "@/components/homepage/ScholarshipSearchSection";
import FadeIn from "@/components/motion/FadeIn";

export const metadata: Metadata = {
  title: "Scholarships",
  description:
    "Search scholarships and funding opportunities for studying abroad with Gramel Education, Nigeria's trusted study abroad agency in Abuja. Filter by name and destination country.",
};

export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  return (
    <main className="pt-14">
      <section className="px-6 md:px-12 xl:px-20">
        <div className="relative mx-auto h-64 max-w-[83.75rem] overflow-hidden rounded-2xl bg-primary shadow-xl md:h-[27.875rem]">
          <Image
            src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1340&h=446&fit=crop"
            alt="A graduating student celebrating with a scholarship"
            width={1340}
            height={446}
            className="h-full w-full rounded-2xl object-cover"
            priority
          />
          <div className="absolute top-0 h-full w-full bg-gradient-to-t from-primary/90 via-primary/70 to-primary/50" />

          <FadeIn className="absolute top-1/2 left-1/2 w-full -translate-1/2 px-4 text-center">
            <h1 className="mb-6 text-4xl font-semibold text-white md:text-6xl">
              Scholarships
            </h1>
            <p className="mx-auto max-w-xl text-white">
              Search scholarship and funding opportunities to make your study
              abroad journey more affordable.
            </p>
          </FadeIn>
        </div>
      </section>

      <ScholarshipSearchSection
        initialSearch={params.search}
        initialCountry={params.country}
      />
    </main>
  );
}
