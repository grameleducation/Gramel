import Image from "next/image";
import AboutAccordion from "./AboutAccordion";
import gramel_icon from "../../../../public/gramel-icon.png";
import gramel_white_icon from "../../../../public/gramel-white-icon.png";
import React from "react";
import CTASection from "@/components/CTASection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Gramel Education, a study abroad agency and company based in Abuja, Nigeria, helping students across Nigeria access international education since 2019.",
};

const timeline = [
  {
    year: "2019",
    title: "Gramel Education is Founded",
    body: "Started with a small team and big dreams to help a handful of students navigate the study abroad process with real support and honest advice.",
  },
  {
    year: "2020",
    title: "First International Placements",
    body: "Gramel helped its first 50 students gain admission into schools in Canada, the UK, and the U.S., marking the beginning of a growing global footprint.",
  },
  {
    year: "2021",
    title: "Partnership with ApplyBoard",
    body: "We joined ApplyBoard's partner network, giving our students access to thousands of institutions worldwide from one centralized platform.",
  },
  {
    year: "2022",
    title: "Launch of Financial Support Services",
    body: "Introduced guidance on student loans, scholarships, and income share agreements—making global education more affordable for African students.",
  },
  {
    year: "2023",
    title: "1,000+ Students Served",
    body: "Crossed a major milestone with over 1,000 students placed in international programs and supported through the visa, finance, and relocation process.",
  },
  {
    year: "2025",
    title: "and Beyond",
    body: "We're scaling across Africa, launching a student alumni network, and investing in tech tools to make global education accessible to 50,000+ students by 2030.",
  },
];

function getDivider(idx: number) {
  if (idx === timeline.length - 1) return null;
  return (
    <>
      {idx % 2 === 0 && idx < 5 && (
        <div className="hidden h-12 w-px bg-gradient-to-b from-white/0 via-white to-white/0 md:block lg:hidden" />
      )}
      {idx % 3 !== 2 && idx < 5 && (
        <div className="hidden h-12 w-px bg-gradient-to-b from-white/0 via-white to-white/0 lg:block" />
      )}
    </>
  );
}

export default async function AboutUsPage() {
  return (
    <main className="pt-14">
      <section className="px-6 md:px-12 xl:px-20">
        <div className="relative mx-auto h-64 max-w-[83.75rem] overflow-hidden rounded-2xl bg-primary md:h-[27.875rem]">
          <Image
            src="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754940044/gramel/public/about-us-page/about-us-page-banner_ufweik.jpg"
            alt="A university building"
            width={1340}
            height={446}
            className="h-full w-full rounded-2xl object-cover"
            priority
          />

          <div className="absolute top-1/2 left-1/2 w-full -translate-1/2 px-4 text-center">
            <h1 className="mb-6 text-4xl font-semibold text-white md:text-6xl">
              About Us
            </h1>
            <p className="text-white">
              Learn more about who we are, what we stand for, and how we&apos;re
              helping students achieve their international education goals.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:mt-14 xl:px-20">
        <div className="mx-auto flex max-w-[71.25rem] flex-col gap-10 py-12 lg:flex-row lg:gap-15 xl:gap-20">
          {/* Left Column: Text Content */}
          <div className="flex-1">
            <h2 className="mb-5 text-3xl leading-tight font-semibold tracking-tight text-primary max-lg:text-center md:text-4xl xl:text-5xl">
              Empowering Students, Transforming Futures
            </h2>
            <p className="mb-16 text-[#5c6c7b] max-lg:text-center">
              At Gramel Education, we believe that the right education can
              change everything. We&apos;re a full-service education management
              company dedicated to guiding students through the life-changing
              journey of studying abroad. From school selection to financial aid
              and visa support, we offer personalized, end-to-end services that
              simplify the process and amplify your chances of success.
            </p>
            <AboutAccordion />
          </div>

          {/* Image container */}
          <div className="h-[21.25rem] w-full rounded-2xl bg-[#dee2e5] md:h-[26.25rem] lg:h-auto lg:w-1/2 lg:max-w-[31.25rem]">
            <Image
              src="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754940047/gramel/public/about-us-page/clay-banks_b4u096.jpg"
              alt="Clay Banks"
              width={640}
              height={646}
              className="h-full w-full rounded-2xl object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#f1f4ff] px-6 py-15 md:px-12 md:py-25 lg:mt-14 xl:px-20">
        <div className="mx-auto grid max-w-[71.25rem] grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-15">
          {/* Image container */}
          <div className="h-96 rounded-3xl bg-[#8ec3fb] p-6 lg:h-auto">
            <Image
              src="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754940050/gramel/public/about-us-page/institution-building_s17xkd.jpg"
              alt="A university building"
              width={640}
              height={427}
              className="h-full w-full rounded-2xl object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>

          {/* our story */}
          <div>
            <div className="flex items-center gap-3">
              <Image src={gramel_icon} alt="Gramel Icon" className="h-6" />
              <p className="text-lg leading-normal text-primary-300">
                OUR STORY
              </p>
            </div>

            {/* Flex container */}
            <div className="mt-4 space-y-5">
              <h2 className="text-left text-3xl leading-tight font-bold text-primary lg:text-5xl">
                Born from a Passion to Empower Students
              </h2>

              <p className="text-left text-lg text-neutral-300">
                Gramel Education was founded with a simple goal: to make
                international education more accessible for students who have
                the potential but not always the resources. What started as a
                small consulting service has grown into a trusted brand helping
                hundreds of students get admitted, funded, and relocated to top
                schools abroad.
                <br />
                <br />
                Through partnerships with global platforms like ApplyBoard and a
                deep understanding of local student needs, we’ve built a model
                that combines tech-driven efficiency with human support.
              </p>

              <p className="text-left text-lg font-extrabold text-primary-900">
                We&apos;re not just helping students study abroad—we&apos;re
                changing lives, one success story at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-15 bg-primary px-6 py-20 text-white md:px-12 xl:px-20">
        <div className="mx-auto max-w-screen-xl">
          <div className="mx-auto flex max-w-max items-center gap-3">
            <Image src={gramel_white_icon} alt="Gramel Icon" className="h-6" />
            <p className="text-lg leading-normal text-primary-300">
              OUR VISION
            </p>
          </div>

          <div className="mt-4 space-y-6">
            <h2 className="mx-auto max-w-[53rem] text-center text-3xl leading-tight font-semibold lg:text-5xl">
              A World Where Every Ambitious Student Has the Chance to Go Global
            </h2>

            <p className="mx-auto max-w-[64.5rem] text-center text-[#E6E6EB] lg:text-lg">
              At Gramel Education, our vision is to become Africa&apos;s most
              trusted bridge to global education—helping thousands of students
              not just gain admission, but truly thrive abroad. We see a future
              where borders don&apos;t limit brilliance, where a student in any
              city or village can access world-class education, and where
              financial or systemic barriers no longer hold anyone back.
            </p>
          </div>

          {/* Timeline Section */}
          <div className="mt-16 flex flex-col flex-wrap items-center justify-between gap-8 md:flex-row">
            {timeline.map((item, idx) => (
              <React.Fragment key={item.year}>
                <div className="flex flex-col md:w-[calc(50%-65px)] lg:w-[calc(33.33%-49px)]">
                  <span className="text-5xl leading-none font-medium">
                    {item.year}
                  </span>
                  <span className="text-2xl leading-tight font-medium">
                    {item.title}
                  </span>
                  <div className="mt-5 text-[#E6E6EB]">{item.body}</div>
                </div>
                {getDivider(idx)}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-15 bg-[#1e1e1e] px-6 py-20 text-white md:px-12 lg:py-25 xl:px-20">
        <div className="mx-auto max-w-[72.5rem]">
          <div className="space-y-5">
            <div className="mx-auto flex max-w-max items-center gap-3">
              <Image
                src={gramel_white_icon}
                alt="Gramel Icon"
                className="h-6"
              />
              <p className="text-lg leading-normal text-primary-300">
                OUR MISSION
              </p>
            </div>

            <h2 className="mx-auto max-w-[53rem] text-center text-3xl leading-tight font-semibold lg:text-5xl">
              Making Global Education Accessible, Affordable, and Achievable
            </h2>

            <p className="mx-auto max-w-[40.625rem] text-center text-[#5C6C7B]">
              At Gramel Education, our vision is to become Africa&apos;s most We
              exist to break down the barriers to international education for
              students across Africa and beyond. Our mission is rooted in four
              core principles:
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[auto_1fr] lg:gap-15">
            {/* Image container */}
            <div className="h-96 rounded-2xl bg-primary-300 lg:h-auto lg:w-md">
              <Image
                src="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754940046/gramel/public/about-us-page/red-building_hkbgon.jpg"
                alt="A university building"
                width={639}
                height={579}
                className="h-full w-full rounded-2xl object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div className="space-y-2.5">
                <h6 className="text-xl font-semibold text-secondary-yellow">
                  01
                </h6>

                <h5 className="text-2xl font-semibold text-white">
                  Access to Opportunities
                </h5>

                <div className="text-[#5c6c7b]">
                  We connect students to thousands of accredited schools and
                  scholarship options, so they can dream bigger and reach
                  higher, regardless of their background or location.
                </div>
              </div>
              <div className="space-y-2.5">
                <h6 className="text-xl font-semibold text-secondary-yellow">
                  02
                </h6>

                <h5 className="text-2xl font-semibold text-white">
                  Transparent Guidance
                </h5>

                <div className="text-[#5c6c7b]">
                  We believe students deserve honest, clear, and practical
                  advice. That&apos;s why we provide step-by-step support that
                  demystifies the entire admissions, financial aid, and visa
                  process.
                </div>
              </div>

              <div className="space-y-2.5">
                <h6 className="text-xl font-semibold text-secondary-yellow">
                  03
                </h6>

                <h5 className="text-2xl font-semibold text-white">
                  Affordable Pathways
                </h5>

                <div className="text-[#5c6c7b]">
                  From low-interest student loans to income share agreements and
                  funding support, we help students find smarter ways to pay for
                  education without getting buried in debt.
                </div>
              </div>

              <div className="space-y-2.5">
                <h6 className="text-xl font-semibold text-secondary-yellow">
                  04
                </h6>

                <h5 className="text-2xl font-semibold text-white">
                  Student Success First
                </h5>

                <div className="text-[#5c6c7b]">
                  We&apos;re more than advisors—we&apos;re advocates. We work to
                  ensure each student gets the support, encouragement, and tools
                  they need to succeed beyond the classroom.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
