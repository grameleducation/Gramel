import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { getAllCareerRoles, getCareerRole } from "../careersData";
import CareerApplicationForm from "@/components/forms/CareerApplicationForm";

export async function generateStaticParams() {
  return getAllCareerRoles().map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const role = getCareerRole(slug);
  if (!role) return {};
  return {
    title: role.title,
    description: role.summary,
  };
}

export default async function CareerRolePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const role = getCareerRole(slug);
  if (!role) return notFound();

  return (
    <main className="pt-14">
      <div className="mx-auto max-w-screen-2xl px-6 pt-12 md:px-12 xl:px-20">
        <Link
          href="/careers"
          className="text-sm font-semibold text-primary-300 hover:underline"
          prefetch={false}
        >
          ← Back to Careers
        </Link>

        <div className="mt-28 grid gap-10 lg:grid-cols-[2fr_1fr] xl:grid-cols-[3fr_1fr]">
          {/* Role details */}
          <section>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-primary-300/10 px-4 py-2 text-sm font-semibold text-primary-300">
                {role.department}
              </span>
              <span className="rounded-full bg-primary-300/10 px-4 py-2 text-sm font-semibold text-primary-300">
                {role.location}
              </span>
              <span className="rounded-full bg-primary-300/10 px-4 py-2 text-sm font-semibold text-primary-300">
                {role.employmentType}
              </span>
              <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                {role.compensation}
              </span>
            </div>

            <h1 className="mt-4 mb-4 text-3xl font-bold text-primary lg:text-5xl">
              {role.title}
            </h1>
            <p className="mb-8 text-neutral-500 lg:text-lg">{role.summary}</p>

            <div className="space-y-8">
              <div>
                <h2 className="mb-4 text-xl font-semibold text-primary">
                  What You'll Do
                </h2>
                <ul className="space-y-3">
                  {role.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary-300" />
                      <span className="text-[#1e1e1e]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-xl font-semibold text-primary">
                  What We're Looking For
                </h2>
                <ul className="space-y-3">
                  {role.requirements.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary-300" />
                      <span className="text-[#1e1e1e]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-xl font-semibold text-primary">
                  Benefits
                </h2>
                <ul className="space-y-3">
                  {role.benefits.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary-300" />
                      <span className="text-[#1e1e1e]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Application form */}
          <aside id="apply" className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-[#e0e0e0] bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-xl font-bold text-primary">
                Apply for this Role
              </h2>
              <p className="mb-6 text-sm text-neutral-500">
                Fill out the form below and attach your CV. We'll be in
                touch if you're a good fit.
              </p>
              <CareerApplicationForm roleSlug={role.slug} />
            </div>
          </aside>
        </div>
        <hr className="mt-24 border-t border-[#7f7f7f]" />
      </div>
    </main>
  );
}
