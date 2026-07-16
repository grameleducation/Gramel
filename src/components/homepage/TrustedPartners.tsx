"use client";

import { useState } from "react";
import Link from "next/link";
import CountryButtons, { countries } from "./CountryButtons";
import InstitutionCards from "./InstitutionCards";
import { institutionsByCountry } from "@/data/institutions";

export default function TrustedPartners() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCountry = countries[activeIndex];

  return (
    <>
      <CountryButtons activeIndex={activeIndex} onSelect={setActiveIndex} />

      <div className="mx-auto mt-16 max-w-md space-y-12 md:max-w-none">
        <InstitutionCards institutions={institutionsByCountry[activeCountry]} />

        <Link
          href="/"
          className="mx-auto block max-w-max rounded-2xl bg-primary px-6 py-3 text-white duration-300 hover:bg-primary-300"
          prefetch={false}
        >
          Explore More
        </Link>
      </div>
    </>
  );
}
