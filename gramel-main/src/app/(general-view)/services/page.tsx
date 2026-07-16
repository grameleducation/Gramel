import Image from "next/image";
import gramel_icon from "../../../../public/gramel-icon.png";
import CTASection from "@/components/CTASection";
import ServicesGrid from "@/components/services/ServicesGrid";
import WhyChooseUsGrid from "@/components/services/WhyChooseUsGrid";
import HowWeHelpGrid from "@/components/services/HowWeHelpGrid";
import ServicesStats from "@/components/services/ServicesStats";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Abroad Services",
  description:
    "International admissions, document verification, scholarships, visa assistance, student loans, and advisory services from Gramel Education, a study abroad agency in Abuja, Nigeria.",
};

export default function ServicesPage() {
  return (
    <main className="pt-14">
      <section className="px-6 md:px-12 xl:px-20">
        <div className="relative mx-auto h-64 max-w-[83.75rem] overflow-hidden rounded-2xl bg-primary md:h-[27.875rem]">
          <Image
            src="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754940941/gramel/public/services-page/services-page-banner_n2bauf.jpg"
            alt="A university building"
            width={1340}
            height={446}
            className="h-full w-full rounded-2xl object-cover"
            priority
          />
          <div className="absolute top-0 h-full w-full bg-primary/75" />

          <div className="absolute top-1/2 left-1/2 w-full -translate-1/2 px-4 text-center">
            <h1 className="mb-6 text-4xl font-semibold text-white md:text-6xl">
              Our Services
            </h1>
            <p className="text-white">
              Explore our complete range of study abroad solutions, from school
              applications and scholarships to visa support and student
              financing.
            </p>
          </div>
        </div>
      </section>

      {/* Services description */}
      <section className="mx-auto max-w-screen-2xl px-6 py-16 md:px-12 lg:mt-15 lg:pt-8 xl:px-24">
        <div className="flex items-center gap-3">
          <Image src={gramel_icon} alt="Gramel Icon" className="h-6" />
          <p className="text-lg leading-normal text-primary-300">
            WHAT WE CAN DO
          </p>
        </div>

        {/* Flex container */}
        <div className="mt-4 flex flex-col items-start justify-between gap-8 max-lg:items-center lg:flex-row">
          <h2 className="max-w-xl text-center text-4xl leading-tight font-bold text-primary lg:w-1/2 lg:max-w-2xl lg:text-left lg:text-5xl">
            Services
          </h2>

          <div className="text-center lg:w-1/2 lg:max-w-xl lg:text-left lg:text-lg">
            <p className="mb-8 text-neutral-300">
              We don&apos;t just help students apply—we guide them from dream to
              departure. Whether you&apos;re just getting started or already
              comparing admission offers, our personalized support makes the
              process simpler, faster, and more successful.
            </p>

            <strong className="font-primary font-extrabold">
              We&apos;re with you every step of the way.
            </strong>
          </div>
        </div>

        <hr className="my-12.5 bg-[#B6BED9]" />

        {/* services grid container */}
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[10.625rem_1fr]">
          {/* figures */}
          <ServicesStats />

          {/* services */}
          <ServicesGrid />
        </div>
      </section>

      {/* Why choose us */}
      <section className="mt-15 bg-[#f0f0f0] px-6 py-16 md:px-12 xl:px-24 xl:py-30">
        <div className="mx-auto max-w-[71.25rem]">
          {/* Flex container */}
          <div className="mt-4 flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div className="space-y-5 lg:w-1/2">
              <div className="flex items-center justify-center gap-3 lg:justify-start">
                <Image src={gramel_icon} alt="Gramel Icon" className="h-6" />
                <p className="text-lg leading-normal text-primary-300">
                  WHY CHOOSE US
                </p>
              </div>

              <h2 className="max-w-xl text-center text-4xl leading-tight font-bold text-primary lg:max-w-2xl lg:text-left lg:text-5xl">
                Your Trusted Partner for Global Study Success
              </h2>
            </div>

            <p className="text-center text-neutral-300 lg:w-2/5 lg:max-w-xl lg:text-left lg:text-lg">
              Choosing the right education consultancy can make all the
              difference. At Gramel Education, we combine global reach, expert
              support, and a student-first approach to help you confidently
              pursue your dreams of studying abroad. We don&apos;t just process
              applications, we walk with you from start to finish.
            </p>
          </div>

          {/* why choose us cards */}
          <WhyChooseUsGrid />
        </div>
      </section>

      <section className="mt-30 mb-25 px-6 md:px-12 xl:px-24">
        <div className="mx-auto max-w-[71.25rem]">
          <div className="space-y-5 lg:w-1/2">
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <Image src={gramel_icon} alt="Gramel Icon" className="h-6" />
              <p className="text-lg leading-normal text-primary-300">
                HOW CAN WE HELP
              </p>
            </div>

            <h2 className="max-w-xl text-center text-4xl leading-tight font-bold text-primary max-lg:mx-auto lg:max-w-2xl lg:text-left lg:text-5xl">
              From First Search to Final Departure
            </h2>
          </div>

          <hr className="mt-22 mb-12.5 bg-[#b6bed9]" />

          <div className="flex flex-col items-center justify-between gap-10 lg:flex-row lg:gap-20">
            <p className="text-2xl font-bold text-primary/90">
              We&apos;ve Got You Covered
            </p>

            <p className="text-center text-base text-[#93969F] lg:max-w-[29.375rem] lg:text-left">
              Studying abroad can feel overwhelming, but you don&apos;t have to
              do it alone. At Gramel Education, we provide step-by-step support
              tailored to your needs—whether you&apos;re exploring options,
              ready to apply, or packing your bags. Here&apos;s how we can help
              you succeed:
            </p>
          </div>

          <HowWeHelpGrid />
        </div>
      </section>

      <CTASection />
    </main>
  );
}
