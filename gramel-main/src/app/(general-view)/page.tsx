import Image from "next/image";
import gramel_icon from "../../../public/gramel-icon.png";
import gramel_white_icon from "../../../public/gramel-white-icon.png";
import WhyChooseUsCards from "@/components/homepage/WhyChooseUsCards";
import AboutUsStats from "@/components/homepage/AboutUsStats";
import Link from "next/link";
import TrustedPartners from "@/components/homepage/TrustedPartners";
import TestimonialsCards from "@/components/homepage/TestimonialCards";
import FAQSection from "@/components/homepage/FAQSection";
import CTASection from "@/components/CTASection";
import PolygonGallery from "@/components/homepage/PolygonGallery";
import ApplyBoardIframe from "@/components/homepage/ApplyBoardIframe";
import EmbeddedSearch from "./EmbeddedSearch";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Abroad Agency in Abuja, Nigeria",
  description:
    "Gramel Education is Nigeria's trusted study abroad agency, based in Abuja. Explore international education options, find your program, and book a free consultation with our study abroad agents.",
};

export default async function HomePage() {
  return (
    <main className="pt-14">
      {/* banner */}
      <section className="mx-auto max-w-screen-2xl px-6 md:px-12 xl:px-20">
        <h1 className="mx-auto max-w-xl text-center text-5xl leading-[110%] font-bold text-primary md:text-[4rem]">
          Your Global Education Partner
        </h1>
        <p className="mx-auto mt-6 max-w-4xl text-center leading-normal text-neutral-300 md:text-lg">
          Gramel Education is a full-service study abroad agency and
          international education company based in Abuja, Nigeria, committed
          to guiding students across Nigeria every step of the way, from
          choosing the right course and school to securing student loans and
          scholarships.
        </p>
      </section>

      {/* === image carousel === */}
      <section className="relative mx-auto my-10 max-w-[150rem] pb-14 lg:pb-25">
        <PolygonGallery />
      </section>

      {/* === FIND YOUR PROGRAM === */}
      <section className="mx-auto max-w-screen-2xl px-6 md:px-12 xl:px-20">
        <div className="mx-auto flex max-w-max items-center gap-3">
          <Image src={gramel_icon} alt="Gramel Icon" className="h-6" />
          <p className="text-lg leading-normal text-primary-300">
            FIND YOUR PROGRAM
          </p>
        </div>

        <div className="mt-4 space-y-6">
          <h2 className="mx-auto max-w-xl text-center text-4xl leading-tight font-bold text-primary lg:max-w-[45rem] lg:text-5xl">
            Search 1,500+ Schools and Programs Worldwide
          </h2>

          <p className="mx-auto max-w-[58rem] text-center text-neutral-300 lg:text-lg">
            As study abroad agents serving students across Nigeria, we make it
            easy to find the right school and program abroad. Search by
            country, level of study, or field of interest to get started.
          </p>
        </div>

        <div className="mt-16">
          <EmbeddedSearch />
        </div>
      </section>

      {/* === why choose us === */}
      <section className="mx-auto max-w-screen-2xl px-6 md:px-12 xl:px-20">
        <div className="flex items-center gap-3">
          <Image src={gramel_icon} alt="Gramel Icon" className="h-6" />
          <p className="text-lg leading-normal text-primary-300">
            WHY CHOOSE US
          </p>
        </div>

        {/* Flex container */}
        <div className="mt-4 flex flex-col items-center justify-between gap-8 lg:flex-row">
          <h2 className="max-w-xl text-center text-4xl leading-tight font-bold text-primary lg:w-1/2 lg:max-w-2xl lg:text-left lg:text-5xl">
            Start Your Study Abroad Journey with Confidence
          </h2>

          <p className="text-center text-neutral-300 lg:w-1/2 lg:max-w-xl lg:text-left lg:text-lg">
            Whether you&apos;re aiming for top universities in Canada, the UK,
            the US, Australia, or elsewhere, we&apos;re here to support your
            journey. Our expert team provides tailored guidance and tools to
            help you succeed. We simplify the journey so students can focus on
            what matters most: achieving their academic dreams.
          </p>
        </div>

        <WhyChooseUsCards />
      </section>

      {/* === BOOK A CONSULTATION === */}
      <section
        id="consultation-form"
        className="mx-auto my-35 max-w-screen-2xl scroll-mt-24 px-6 md:px-12 xl:px-20"
      >
        <div className="mx-auto flex max-w-max items-center gap-3">
          <Image src={gramel_icon} alt="Gramel Icon" className="h-6" />
          <p className="text-lg leading-normal text-primary-300">
            GET STARTED
          </p>
        </div>

        <div className="mt-4 space-y-6">
          <h2 className="mx-auto max-w-xl text-center text-4xl leading-tight font-bold text-primary lg:max-w-[45rem] lg:text-5xl">
            Book Your Free Consultation
          </h2>

          <p className="mx-auto max-w-[58rem] text-center text-neutral-300 lg:text-lg">
            Tell us about your goals and one of our education advisors will
            reach out to help you find the right program, funding, and
            pathway abroad.
          </p>
        </div>

        <div className="relative mx-auto mt-10 aspect-[21/9] w-full max-w-4xl overflow-hidden rounded-3xl">
          <Image
            src="/consultation-student.jpg"
            alt="A student ready to start their study abroad journey"
            fill
            sizes="(max-width: 896px) 100vw, 56rem"
            className="object-cover object-top"
          />
        </div>

        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl bg-[#f8f9fe] p-4 md:p-10">
          <ApplyBoardIframe />
        </div>
      </section>

      {/* === OUR SERVICES === */}
      <section className="mx-auto my-35 max-w-screen-2xl px-6 md:px-12 xl:px-20">
        {/* our services heading */}
        <div className="mx-auto flex max-w-max items-center gap-3">
          <Image
            src={gramel_icon}
            alt="Gramel Icon"
            className="h-6"
            sizes="50vw"
          />
          <p className="text-lg leading-normal text-primary-300">
            OUR SERVICES
          </p>
        </div>

        <div className="mt-4 space-y-6">
          <h2 className="mx-auto max-w-xl text-center text-4xl leading-tight font-bold text-primary lg:max-w-2xl lg:text-5xl">
            Complete Support for Your Study Abroad Success
          </h2>

          <p className="mx-auto max-w-3xl text-center text-neutral-300 lg:text-lg">
            Whether you&apos;re aiming for top universities in Canada, the UK,
            the US, Australia, or elsewhere, we&apos;re here to support your
            journey. Our expert team provides tailored guidance and tools to
            help you succeed. We simplify the journey so students can focus on
            what matters most: achieving their academic dreams.
          </p>
        </div>

        {/* grid container */}
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {/* image container */}
          <div className="rounded-3xl bg-[#8EC3FB] p-10">
            <Image
              src="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977281/gramel/public/home/stacked-books_slg2uy.jpg"
              className="h-full w-full object-cover"
              alt="stacked books with a valedictory cap on top"
              width={539}
              height={522}
            />
          </div>

          <div className="space-y-6 md:py-10">
            <h4 className="text-3xl font-bold text-primary-300">
              Our Services
            </h4>
            <div className="">
              {[
                {
                  name: "International Admission Processing",
                  url: "international-admissions",
                },
                { name: "Document Verification", url: "document-verification" },
                { name: "Scholarships", url: "scholarships" },
                { name: "Visa Assistance", url: "visa-assistance" },
                {
                  name: "Language Proficiency Tests",
                  url: "language-proficiency-tests",
                },
                { name: "Student Loan", url: "student-loan" },
                { name: "Advisory Services", url: "advisory-services" },
              ].map((service, index) => (
                <Link
                  href={"services/" + service.url}
                  key={service.name}
                  className="group flex items-center gap-4 border-b border-[#626060] py-6 text-lg text-[#626060] duration-300 hover:border-primary hover:text-primary lg:text-3xl"
                  prefetch={false}
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#626060] text-white duration-300 group-hover:bg-primary">
                    {index + 1}
                  </span>
                  {service.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === ABOUT US === */}
      <section className="bg-primary p-20 text-white max-md:px-6 md:max-lg:px-12 xl:px-20">
        <div className="mx-auto max-w-screen-2xl">
          {/* our services heading */}
          <div className="mx-auto flex max-w-max items-center gap-3">
            <Image src={gramel_white_icon} alt="Gramel Icon" className="h-6" />
            <p className="text-lg leading-normal text-primary-300">ABOUT US</p>
          </div>

          <div className="mt-4 space-y-6">
            <h2 className="text-center text-4xl leading-tight font-bold lg:text-5xl">
              Empowering Students. <br /> Unlocking Global Opportunities.
            </h2>

            <p className="mx-auto max-w-[58rem] text-center text-[#E6E6EB] lg:text-lg">
              Gramel Education is a full-service education management company
              committed to helping students achieve their international academic
              dreams with clarity, confidence, and the right support at every
              step. Founded on the belief that quality education should be
              accessible to everyone, we provide personalized guidance,
              application support, and financial solutions to help students
              successfully gain admission into top schools around the world.
            </p>
          </div>

          <div className="mt-16 space-y-12">
            <Image
              src="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977282/gramel/public/home/about-us-video-poster_jqsybp.jpg"
              alt="a smiling female student"
              className="h-auto w-full rounded-4xl"
              width={1280}
              height={600}
            />

            <AboutUsStats />
          </div>
        </div>
      </section>

      {/* === TRUSTED PARTNERS === */}
      <section className="mx-auto my-35 max-w-screen-2xl px-6 md:px-12 xl:px-20">
        <div className="mx-auto flex max-w-max items-center gap-3">
          <Image src={gramel_icon} alt="Gramel Icon" className="h-6" />
          <p className="text-lg leading-normal text-primary-300">
            TRUSTED PARTNERS
          </p>
        </div>

        <div className="mt-4 space-y-6">
          <h2 className="mx-auto max-w-xl text-center text-4xl leading-tight font-bold text-primary lg:max-w-[45rem] lg:text-5xl">
            Trusted by Leading Institutions Worldwide
          </h2>

          <p className="mx-auto max-w-[58rem] text-center text-neutral-300 lg:text-lg">
            We work hand-in-hand with top universities, colleges, and education
            platforms around the world to give students access to high-quality
            programs, faster application processing, and more funding
            opportunities. When you choose Gramel Education, you benefit from
            partnerships built on trust and proven results.
          </p>
        </div>

        <TrustedPartners />
      </section>

      {/* === TESTIMONIALS === */}
      <section className="mx-auto max-w-screen-2xl px-6 md:px-12 xl:px-20">
        <div className="mx-auto flex max-w-max items-center gap-3">
          <Image src={gramel_icon} alt="Gramel Icon" className="h-6" />
          <p className="text-lg leading-normal text-primary-300">
            TESTIMONIALS
          </p>
        </div>

        <div className="mt-4 space-y-6">
          <h2 className="mx-auto max-w-xl text-center text-4xl leading-tight font-bold text-primary lg:max-w-[45rem] lg:text-5xl">
            What Our Students Are Saying
          </h2>

          <p className="mx-auto max-w-[58rem] text-center text-neutral-300 lg:text-lg">
            At Gramel Education, we measure our success through the students
            we&apos;ve helped achieve theirs. Whether it&apos;s getting admitted
            to top schools, securing scholarships, or arriving safely abroad,
            our students trust us to guide them through the entire journey and
            we deliver. Here&apos;s what a few of them had to say:
          </p>
        </div>

        <TestimonialsCards />
      </section>

      {/* === FAQS === */}
      <section className="mx-auto my-35 max-w-screen-2xl px-6 md:px-12 xl:px-20">
        <div className="mx-auto flex max-w-max items-center gap-3">
          <Image src={gramel_icon} alt="Gramel Icon" className="h-6" />
          <p className="text-lg leading-normal text-primary-300">FAQS</p>
        </div>

        <div className="mt-4 space-y-6">
          <h2 className="mx-auto max-w-xl text-center text-4xl leading-tight font-bold text-primary lg:max-w-[45rem] lg:text-5xl">
            Helping You Navigate the Path to International Education
          </h2>

          <p className="mx-auto max-w-[58rem] text-center text-neutral-300 lg:text-lg">
            We know studying abroad can feel overwhelming—from choosing the
            right school to figuring out finances and visas. That&apos;s why
            we&apos;ve compiled answers to the most common questions students
            and parents ask us. If you don&apos;t see your question here, our
            team is just a message away.
          </p>
        </div>

        <FAQSection />
      </section>

      {/* === CTA === */}
      <CTASection buttonLink="#consultation-form" />
    </main>
  );
}
