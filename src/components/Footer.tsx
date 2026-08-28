"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import gramel_education_logo from "../../public/gramel-education-logo.png";
import Link from "next/link";
import { FacebookLogo, Linkedin } from "@/lib/icons";
import client_env from "@/utils/env.client";
import { openCookieSettings } from "@/lib/cookieConsent";

// TODO: Fill dummy links
export default function Footer() {
  // On the assist subdomain, every route here belongs to the main site and
  // doesn't exist there -- send these links back to the main domain instead
  // of letting them 404 under assist's rewrite. Detected client-side (not
  // via a server-side host check) so pages using this stay statically
  // prerenderable/cacheable.
  const [isAssist, setIsAssist] = useState(false);
  useEffect(() => {
    setIsAssist(
      window.location.hostname.includes("assist.grameleducation.com"),
    );
  }, []);
  const toHref = (path: string) =>
    isAssist ? `${client_env.NEXT_PUBLIC_BASE_URL}${path}` : path;

  return (
    <footer className="bg-white pt-20 pb-6">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-12 xl:px-20">
        <div className="grid grid-cols-[auto] justify-center gap-y-8 text-center text-neutral-300 sm:grid-cols-2 sm:text-left md:grid-cols-[auto_auto_auto_auto] md:justify-between md:gap-0">
          <div className="space-y-3">
            <Link prefetch={false} href={toHref("/")}>
              <Image src={gramel_education_logo} alt="Gramel Education Logo" />
            </Link>
            <p className="max-w-56 text-sm text-neutral-300">
              50, Ebitu Ukiwe Street, Jabi, Abuja, Nigeria.
            </p>
          </div>

          <ul className="space-y-3">
            <h5 className="font-semibold text-neutral-500">Gramel Education</h5>
            <li>
              <Link
                href={toHref("/about-us")}
                className="hover:text-neutral-500"
                prefetch={false}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href={toHref("/services")}
                className="hover:text-neutral-500"
                prefetch={false}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href={toHref("/careers")}
                className="hover:text-neutral-500"
                prefetch={false}
              >
                Careers
              </Link>
            </li>
          </ul>

          <ul className="space-y-3">
            <h5 className="font-semibold text-neutral-500">Quick Links</h5>
            <li>
              <Link
                href={toHref("/programs")}
                className="hover:text-neutral-500"
                prefetch={false}
              >
                Programs
              </Link>
            </li>
            <li>
              <Link
                href={toHref("/scholarships")}
                className="hover:text-neutral-500"
                prefetch={false}
              >
                Scholarships
              </Link>
            </li>
            <li>
              <Link
                href={toHref("/services/international-admissions")}
                className="hover:text-neutral-500"
                prefetch={false}
              >
                Admissions
              </Link>
            </li>
            <li>
              <Link
                href={toHref("/student-profile")}
                className="hover:text-neutral-500"
                prefetch={false}
              >
                Student Portal
              </Link>
            </li>
          </ul>

          <ul className="space-y-3">
            <h5 className="font-semibold text-neutral-500">Legal</h5>
            <li>
              <Link
                href={toHref("/privacy")}
                className="hover:text-neutral-500"
                prefetch={false}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href={toHref("/terms")}
                className="hover:text-neutral-500"
                prefetch={false}
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href={toHref("/cookie-policy")}
                className="hover:text-neutral-500"
                prefetch={false}
              >
                Cookie Policy
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => openCookieSettings()}
                className="hover:text-neutral-500"
              >
                Cookie Settings
              </button>
            </li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-neutral-300 pt-6 text-center md:flex-row md:items-start">
          <p className="font-semibold text-[#1e1e1e] md:text-lg">
            &copy; {new Date().getFullYear()} by Gramel Education. All rights
            reserved.
          </p>

          {/* Social Icons and Chat */}
          <div className="flex gap-3">
            {/* Chat with us button */}
            <Link
              href={toHref("/contact")}
              aria-label="Chat with us"
              className="flex size-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white hover:bg-primary-300 duration-300"
              prefetch={false}
            >
              Chat
            </Link>

            {/* Instagram Icon */}
            <Link
              href="https://instagram.com/grameleducation"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gramel Education on Instagram"
              className="flex size-12 items-center justify-center rounded-full bg-primary text-2xl text-white"
              prefetch={false}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </Link>

            {/* Facebook Icon */}
            <Link
              href="https://web.facebook.com/PointOneTravels/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gramel Education on Facebook"
              className="flex size-12 items-center justify-center rounded-full bg-primary text-2xl text-white"
              prefetch={false}
            >
              <FacebookLogo />
            </Link>

            {/* LinkedIn Icon */}
            <Link
              href="https://www.linkedin.com/company/grameleducation"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gramel Education on LinkedIn"
              className="flex size-12 items-center justify-center rounded-full bg-primary text-2xl text-white"
              prefetch={false}
            >
              <Linkedin />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
