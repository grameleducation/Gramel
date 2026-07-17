"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import gramel_education_logo from "../../public/gramel-education-logo.png";
import Link from "next/link";
import { Twitter } from "@/lib/icons";
import client_env from "@/utils/env.client";

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
              Study abroad agency based in 50, Ebitu Ukiwe Street, Jabi, Abuja,
              Nigeria.
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
                href="#"
                className="hover:text-neutral-500"
                prefetch={false}
              >
                Schools
              </Link>
            </li>
            <li>
              <Link
                href={toHref("/programs")}
                className="hover:text-neutral-500"
                prefetch={false}
              >
                Programs
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
                href="#"
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
            <li>
              <Link
                href="#"
                className="hover:text-neutral-500"
                prefetch={false}
              >
                Events
              </Link>
            </li>
          </ul>

          <ul className="space-y-3">
            <h5 className="font-semibold text-neutral-500">Legal</h5>
            <li>
              <Link
                href="#"
                className="hover:text-neutral-500"
                prefetch={false}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href={toHref("/services")}
                className="hover:text-neutral-500"
                prefetch={false}
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-neutral-300 pt-6 text-center md:flex-row md:items-start">
          <p className="font-semibold text-[#1e1e1e] md:text-lg">
            &copy; {new Date().getFullYear()} by Gramel Education. All rights
            reserved.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3">
            {/* Instagram Icon */}
            <Link
              href="#"
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

            {/* Twitter Icon */}
            <Link
              href="#"
              className="flex size-12 items-center justify-center rounded-full bg-primary text-2xl text-white"
              prefetch={false}
            >
              <Twitter />
            </Link>

            {/* Yotube Icon */}
            <Link
              href="#"
              className="flex size-12 items-center justify-center rounded-full bg-primary text-2xl text-white"
              prefetch={false}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="m9.723 8.799l5.941 3.1l-.731.379z"
                  clipRule="evenodd"
                  opacity=".5"
                ></path>
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M21.906 5.516c.66.657.874 2.15.874 2.15S23 9.418 23 11.17v1.642c0 1.753-.22 3.505-.22 3.505s-.215 1.492-.874 2.15c-.754.777-1.59.857-2.063.902l-.142.015c-3.078.219-7.701.226-7.701.226s-5.72-.052-7.48-.218q-.127-.022-.3-.04c-.558-.067-1.432-.17-2.126-.885c-.66-.657-.874-2.15-.874-2.15S1 14.566 1 12.813V11.17c0-1.752.22-3.504.22-3.504s.215-1.493.874-2.15c.755-.777 1.591-.857 2.063-.903q.078-.006.142-.014c3.078-.219 7.696-.219 7.696-.219h.01s4.618 0 7.696.22l.142.014c.472.045 1.309.125 2.063.902M15.664 11.9l-5.94 3.078V8.799z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
