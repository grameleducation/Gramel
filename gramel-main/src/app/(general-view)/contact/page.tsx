import CTASection from "@/components/CTASection";
import ContactForm from "@/components/forms/ContactForm";
import { FacebookLogo, InstagramSolid, Linkedin, Twitter } from "@/lib/icons";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Gramel Education, a study abroad agency in Abuja, Nigeria. Visit us at 50, Ebitu Ukiwe Street, Jabi, Abuja, call 07041041810, or email info@grameleducation.com.",
};

export default function ContactPage() {
  return (
    <main className="pt-14">
      <section className="px-6 md:px-12 xl:px-20">
        <div className="relative mx-auto h-64 max-w-[83.75rem] rounded-2xl bg-primary md:h-[27.875rem]">
          <Image
            src="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754941497/gramel/public/contact-page/contact-page-banner_lyimda.jpg"
            alt="A university building"
            width={1340}
            height={446}
            className="h-full w-full rounded-2xl object-cover"
            priority
          />
          <h1 className="absolute bottom-12 left-12 text-4xl font-semibold text-white md:text-6xl">
            Contact Us
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-6 py-16 md:px-12 lg:mt-15 lg:pt-8 xl:px-24">
        {/* Brief about us - grid container */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-15">
          {/* grid container to separate top and bottom content */}
          <div className="grid content-between gap-6">
            {/* top content */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold tracking-tight text-primary lg:text-5xl">
                We&apos;re Here to Help You Take the First Step...
              </h1>
              <p className="text-neutral-500 max-xs:text-sm">
                Whether you&apos;re just exploring your study abroad options or
                need support with your ongoing application, our team is ready to
                assist you. Reach out with your questions, and let&apos;s move
                your education journey forward together.
              </p>
            </div>

            {/* bottom content */}
            <div className="grid justify-between gap-6 sm:grid-cols-[auto_auto]">
              <div className="max-w-[15.635rem] space-y-4">
                <h4 className="text-lg font-bold text-[#62A9DC] xs:text-2xl">
                  Phone Contact
                </h4>
                <p className="font-semibold text-black max-xs:text-sm">
                  07041041810
                </p>
              </div>
              <div className="max-w-[15.635rem] space-y-4">
                <h4 className="text-lg font-bold text-[#62A9DC] xs:text-2xl">
                  Our Location
                </h4>
                <p className="font-semibold text-black max-xs:text-sm">
                  50, Ebitu Ukiwe Street, Jabi, Abuja, Nigeria.
                </p>
              </div>
              <div className="max-w-[15.635rem] space-y-4">
                <h4 className="text-lg font-bold text-[#62A9DC] xs:text-2xl">
                  Email
                </h4>
                <p className="font-semibold text-black max-xs:text-sm">
                  info@grameleducation.com
                </p>
              </div>
              <div className="max-w-[15.635rem] space-y-4">
                <h4 className="text-lg font-bold text-[#62A9DC] xs:text-2xl">
                  Social Network
                </h4>
                {/* TODO: Activate social network links */}
                <div className="flex items-center gap-4 text-xl text-black">
                  <Link
                    href="#"
                    className="duration-300 hover:text-neutral-300"
                    prefetch={false}
                  >
                    <InstagramSolid />
                  </Link>
                  <Link
                    href="#"
                    className="duration-300 hover:text-neutral-300"
                    prefetch={false}
                  >
                    <Twitter />
                  </Link>
                  <Link
                    href="#"
                    className="duration-300 hover:text-neutral-300"
                    prefetch={false}
                  >
                    <FacebookLogo />
                  </Link>
                  <Link
                    href="#"
                    className="duration-300 hover:text-neutral-300"
                    prefetch={false}
                  >
                    <Linkedin />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* <CTASection /> */}
    </main>
  );
}
