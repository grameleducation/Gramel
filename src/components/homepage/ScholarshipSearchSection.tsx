"use client";

import { useState } from "react";
import { Search, Filter, Zap } from "lucide-react";
import Image from "next/image";
import gramel_icon from "../../../public/gramel-icon.png";
import { scholarshipsData, type Scholarship } from "@/data/scholarships";

const FILTER_COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Ireland",
  "New Zealand",
];

function filterScholarships(term: string, country: string) {
  let filtered = scholarshipsData;

  if (term) {
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(term.toLowerCase()) ||
        s.description.toLowerCase().includes(term.toLowerCase()),
    );
  }

  if (country) {
    filtered = filtered.filter((s) => s.countries.includes(country));
  }

  return filtered;
}

export default function ScholarshipSearchSection({
  initialSearch = "",
  initialCountry = "",
}: {
  initialSearch?: string;
  initialCountry?: string;
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [results, setResults] = useState<Scholarship[]>(() =>
    filterScholarships(initialSearch, initialCountry),
  );

  const handleSearch = (term: string, country: string) => {
    setResults(filterScholarships(term, country));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    handleSearch(value, selectedCountry);
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    handleSearch(searchTerm, value);
  };

  return (
    <section
      id="scholarships"
      className="mx-auto max-w-screen-2xl scroll-mt-24 px-6 py-16 md:px-12 xl:px-20"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image src={gramel_icon} alt="Gramel Icon" className="h-6" />
            <p className="text-lg leading-normal text-primary-300">
              SCHOLARSHIPS & FUNDING
            </p>
          </div>
          <h2 className="text-4xl font-bold text-primary lg:text-5xl">
            Find Scholarships and Funding Opportunities
          </h2>
          <p className="text-lg text-neutral-300">
            Explore thousands of scholarship opportunities to make your study
            abroad journey more affordable. Our database includes merit-based,
            need-based, and regional scholarships.
          </p>
        </div>

        {/* Search Bar */}
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-lg">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search scholarships by name..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                <option value="">Filter by country...</option>
                {FILTER_COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <button className="flex items-center justify-center gap-2 rounded-lg bg-primary-300 py-3 text-white transition-colors hover:bg-primary">
              <Search className="h-5 w-5" />
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-neutral-400">
            Found {results.length} scholarship(s)
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.length > 0 ? (
              results.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-primary">
                        {scholarship.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-2 text-sm font-bold text-primary-300">
                        <Zap className="h-4 w-4" />
                        {scholarship.amount}
                      </p>
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-neutral-300">
                    {scholarship.description}
                  </p>

                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-semibold text-neutral-400">
                      AVAILABLE IN:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {scholarship.countries.map((country) => (
                        <span
                          key={country}
                          className="inline-block rounded-full bg-primary-300/10 px-3 py-1 text-xs font-medium text-primary-300"
                        >
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 border-t border-neutral-200 pt-4">
                    <p className="text-xs font-semibold text-neutral-400">
                      ELIGIBILITY:
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {scholarship.eligibility}
                    </p>
                  </div>

                  <div className="mb-4 text-xs text-neutral-400">
                    <p className="font-semibold">Deadline: {scholarship.deadline}</p>
                  </div>

                  <button className="w-full rounded-lg bg-primary-300 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary">
                    Learn More & Apply
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-2xl bg-neutral-50 p-12 text-center">
                <p className="text-neutral-400">
                  No scholarships found. Try adjusting your search filters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-primary-300 to-primary p-8 text-center text-white">
          <h3 className="text-2xl font-bold">Not sure which scholarship suits you?</h3>
          <p className="mt-2 opacity-90">
            Book a free consultation with our education advisors to find the perfect
            funding option for your study abroad journey.
          </p>
          <button className="mt-6 rounded-lg bg-white px-8 py-3 font-semibold text-primary-300 transition-colors hover:bg-neutral-50">
            Book Your Free Consultation
          </button>
        </div>
      </div>
    </section>
  );
}
