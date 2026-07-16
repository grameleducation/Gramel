"use client";

import Link from "next/link";
import logo from "../../public/gramel-education-logo.png";
import Image from "next/image";
import { ChevronDown, LoaderCircle, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuthContext } from "@/context/AuthContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { RequirePermission } from "./auth/RequirePermission";
import { UserActions } from "@/lib/permissions/role";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/assist", label: "Assist" },
  { href: "/contact", label: "Contact Us" },
];

// Service links for hover card
const serviceLinks = [
  {
    slug: "international-admissions",
    title: "International Admission Processing",
  },
  { slug: "document-verification", title: "Document Verification" },
  { slug: "scholarships", title: "Scholarships" },
  { slug: "visa-assistance", title: "Visa Assistance" },
  { slug: "language-proficiency-tests", title: "Language Proficiency Tests" },
  { slug: "student-loan", title: "Student Loan" },
  { slug: "advisory-services", title: "Advisory Services" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isUserLoading, isLoggingOut, handleLogout } = useAuthContext();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const showBorder = !["/login", "/signup"].some((path) =>
    pathname.startsWith(path),
  );

  return (
    <nav className={showBorder ? "border-b border-gray-200 bg-white" : ""}>
      <div className="relative mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-5 lg:px-12">
        {/* logo */}
        <Link href="/" className="" prefetch={false}>
          <Image src={logo} alt="Gramel Logo" className="h-8 w-auto lg:h-9" />
        </Link>

        {/* nav links */}
        <ul className="hidden items-center text-sm text-neutral-500 md:flex lg:text-base">
          {navLinks.map((link, index) => {
            if (link.label.trim().toLocaleLowerCase() === "services") {
              return (
                <li key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className={`flex cursor-pointer items-center rounded-2xl px-5 py-2 duration-300 ${pathname.startsWith("/services") ? "bg-primary-300/20" : "hover:bg-primary-300/10"}`}
                      >
                        {link.label} <ChevronDown strokeWidth={1.5} />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      className="w-max bg-white p-8 py-5 shadow-2xl inset-shadow-sm"
                      arrowClassName="bg-white fill-white"
                    >
                      <ul className="grid grid-cols-2 gap-4 gap-x-8 marker:text-primary-300">
                        {serviceLinks.map(({ slug, title }) => (
                          <li className="list-inside list-disc" key={slug}>
                            <Link
                              prefetch={false}
                              href={`/services/${slug}`}
                              className="rounded-lg text-sm text-nowrap text-primary duration-200 hover:underline"
                            >
                              {title}
                            </Link>
                          </li>
                        ))}
                        <li className="col-span-2 mt-2">
                          <Link
                            prefetch={false}
                            href="/services"
                            className="block rounded-lg bg-primary-300/10 px-3 py-2 text-center text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary-300 hover:text-white"
                          >
                            All Services
                          </Link>
                        </li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            }
            return (
              <li key={index}>
                <Link
                  prefetch={false}
                  href={link.href}
                  className={`rounded-2xl px-5 py-2 duration-300 ${pathname === link.href ? "bg-primary-300/20" : "hover:bg-primary-300/10"}`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* desktop login button */}
        {isUserLoading ? (
          <button className="hidden animate-pulse rounded-2xl bg-gray-400 px-6 py-3 text-gray-400 opacity-50 md:inline-block">
            Log Out {/* Not visible. Just to retain button size */}
          </button>
        ) : !user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden items-center gap-2 rounded-2xl border-transparent bg-primary px-6 py-3 text-white duration-300 hover:bg-primary-300 md:flex">
                Log In <ChevronDown className="text-2xl" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-primary-300">
              <DropdownMenuItem asChild>
                <Link
                  prefetch={false}
                  href="/login"
                  className="rounded-2xl px-6 py-3 font-semibold text-white duration-300 hover:text-primary"
                >
                  Log In
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  prefetch={false}
                  href="/signup"
                  className="rounded-2xl px-6 py-3 font-semibold text-white duration-300 hover:text-primary"
                >
                  Create Account
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            {/* Student Profile Link */}
            <RequirePermission
              action={UserActions.view_student_profile}
              role={user.role}
            >
              <Link
                prefetch={false}
                href="/student-profile"
                className="hidden rounded-2xl border-2 border-primary bg-transparent px-4 py-1.5 text-sm font-semibold text-primary duration-300 hover:border-primary-300 hover:bg-primary-300 hover:text-white md:inline-block lg:px-6 lg:text-base"
              >
                Profile
              </Link>
            </RequirePermission>

            {/* Admin Dashboard Link */}
            <RequirePermission
              action={UserActions.view_admin_dashboard}
              role={user.role}
            >
              <Link
                prefetch={false}
                href="/dashboard"
                className="hidden rounded-2xl border-2 border-primary bg-transparent px-4 py-1.5 text-sm font-semibold text-primary duration-300 hover:border-primary-300 hover:bg-primary-300 hover:text-white md:inline-block lg:px-6 lg:text-base"
              >
                Dashboard
              </Link>
            </RequirePermission>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="group relative hidden cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-red-500 px-6 py-1.5 text-sm font-semibold text-red-500 duration-300 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-90 md:flex lg:text-base"
            >
              <LoaderCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin opacity-0 duration-300 group-disabled:opacity-100" />
              <span
                className={"opacity-100 duration-300 group-disabled:opacity-0"}
              >
                Log Out
              </span>
            </button>
          </div>
        )}

        {/* menu toggle button */}
        <button
          onClick={toggleMenu}
          className="text-neutral-500 hover:text-neutral-300 md:hidden"
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>

        {/* mobile nav menu */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-screen duration-300 ease-in-out md:hidden ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* background overlay */}
          <div
            onClick={toggleMenu}
            className={`absolute inset-0 bg-black/10 transition-all delay-300 duration-1000 ease-out ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          ></div>

          <div className="relative float-right flex h-full w-4/5 flex-col bg-white shadow-lg">
            {/* close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={toggleMenu}
                className="text-neutral-500 hover:text-neutral-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* mobile nav links */}
            <ul className="flex flex-col space-y-6 px-6 text-neutral-500">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    prefetch={false}
                    href={link.href}
                    className="block duration-300 hover:text-neutral-300"
                    onClick={toggleMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <MobileScreenLoginDropDown toggleMenu={toggleMenu} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

function MobileScreenLoginDropDown({ toggleMenu }: { toggleMenu: () => void }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
  const { user, isUserLoading, isLoggingOut, handleLogout } = useAuthContext();

  // Measure trigger width after layout
  useEffect(() => {
    if (triggerRef.current)
      setTriggerWidth(triggerRef.current.getBoundingClientRect().width);
  }, []);

  return isUserLoading ? (
    // Loading skeleton
    <button
      ref={triggerRef}
      className="Block w-full animate-pulse rounded-2xl bg-gray-400 px-6 py-3 text-gray-400 opacity-50 duration-300"
    >
      Log In
    </button>
  ) : !user ? (
    // Drop down menu for users not logged in
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          ref={triggerRef}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-white duration-300 hover:bg-primary-300"
        >
          Log In <ChevronDown className="text-2xl" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-primary-300"
        // Ensure dropped-down items have the same width as the trigger
        style={{ width: triggerWidth ? `${triggerWidth}px` : "auto" }}
      >
        <DropdownMenuItem asChild>
          <Link
            prefetch={false}
            onClick={toggleMenu}
            href="/login"
            className="flex w-full justify-center rounded-2xl px-6 py-3 font-semibold text-white duration-300 hover:text-primary"
          >
            Log In
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            prefetch={false}
            onClick={toggleMenu}
            href="/signup"
            className="flex w-full justify-center rounded-2xl px-6 py-3 font-semibold text-white duration-300 hover:text-primary"
          >
            Create Account
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    // Log out button for logged in users
    <div className="flex flex-col gap-4">
      {/* Student Profile link */}
      <RequirePermission
        action={UserActions.view_student_profile}
        role={user.role}
      >
        <Link
          prefetch={false}
          onClick={toggleMenu}
          href="/student-profile"
          className="rounded-sm border-2 border-primary bg-transparent px-6 py-1 text-center font-semibold text-primary duration-300 hover:border-primary-300 hover:bg-primary-300 hover:text-white"
        >
          Profile
        </Link>
      </RequirePermission>

      {/* Admin Dashboard link */}
      <RequirePermission
        action={UserActions.view_admin_dashboard}
        role={user.role}
      >
        <Link
          prefetch={false}
          onClick={toggleMenu}
          href="/dashboard"
          className="rounded-sm border-2 border-primary bg-transparent px-6 py-1 text-center font-semibold text-primary duration-300 hover:border-primary-300 hover:bg-primary-300 hover:text-white"
        >
          Dashboard
        </Link>
      </RequirePermission>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border-2 border-transparent bg-red-500 px-6 py-1 font-semibold text-white duration-300 hover:border-red-500 hover:bg-transparent hover:text-red-500"
      >
        <LoaderCircle className="hidden animate-spin group-disabled:block" />
        {isLoggingOut ? "Logging Out..." : "Log Out"}
      </button>
    </div>
  );
}
