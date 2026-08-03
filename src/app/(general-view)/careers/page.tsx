import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getAllCareerRoles } from "./careersData";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the Gramel Education team in Abuja, Nigeria. View open roles and apply today.",
};

export default function CareersPage() {
  const roles = getAllCareerRoles();

  return (
    <main className="pt-14">
      <section className="mx-auto max-w-screen-2xl px-6 py-16 md:px-12 md:py-24 xl:px-20">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold text-primary-300 uppercase tracking-wide">
            Careers at Gramel
          </p>
          <h1 className="text-4xl font-bold text-primary md:text-5xl">
            Help Students Reach Their Study Abroad Goals
          </h1>
          <p className="text-lg text-neutral-500">
            We're a growing study abroad agency based in Abuja, Nigeria,
            helping students across the country access international
            education. Join a team that's making that journey possible.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-6 pb-16 md:px-12 md:pb-24 xl:px-20">
        <h2 className="mb-8 text-2xl font-bold text-primary">Open Roles</h2>

        {roles.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-[#e0e0e0] bg-[#f9f9f9] py-16 text-center">
            <p className="text-lg text-neutral-500">
              We don't have any open roles right now.
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Check back soon &mdash; we're growing.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {roles.map((role) => (
              <Link
                key={role.slug}
                href={`/careers/${role.slug}`}
                className="group block rounded-2xl border border-[#e0e0e0] bg-white p-8 shadow-sm transition-all duration-300 hover:border-primary-300 hover:shadow-md"
                prefetch={false}
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-primary transition-colors duration-300 group-hover:text-primary-300">
                      {role.title}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {role.department} &middot; {role.location} &middot;{" "}
                      {role.employmentType}
                    </p>
                    <p className="text-sm font-semibold text-primary-300">
                      {role.compensation}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-2 font-medium text-primary-300">
                    View Role
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
