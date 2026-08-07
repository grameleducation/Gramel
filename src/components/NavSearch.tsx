"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

const QUICK_COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia"];

type SearchTab = "programs" | "scholarships";

const TABS: { id: SearchTab; label: string }[] = [
  { id: "programs", label: "Schools & Programs" },
  { id: "scholarships", label: "Scholarships" },
];

export default function NavSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<SearchTab>("programs");
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");

  // Lock body scroll and allow Escape to close while the overlay is open
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (country) params.set("country", country);

    const destination = tab === "programs" ? "/programs" : "/scholarships";
    router.push(params.toString() ? `${destination}?${params}` : destination);
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Search schools, programs, and scholarships"
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-neutral-500 duration-300 hover:bg-primary-300/10 hover:text-primary-300"
      >
        <Search className="size-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-4 pt-24 backdrop-blur-sm">
          {/* backdrop */}
          <div
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* panel */}
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-primary">
                  Search Gramel
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  Find schools, programs, and scholarships in one place.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close search"
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-400 duration-300 hover:bg-neutral-100 hover:text-neutral-600"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* tabs */}
            <div className="mb-5 flex gap-2 rounded-xl bg-neutral-100 p-1">
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold duration-200 ${
                    tab === id
                      ? "bg-white text-primary shadow-sm"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-neutral-400" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    tab === "programs"
                      ? "What would you like to study?"
                      : "Search scholarships by name..."
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pr-4 pl-11 text-sm focus:border-primary-300 focus:ring-2 focus:ring-primary-300 focus:outline-none"
                />
              </div>

              <div className="space-y-2.5">
                <p className="text-sm font-semibold text-neutral-500">
                  Destination
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {QUICK_COUNTRIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCountry(country === c ? "" : c)}
                      className={`rounded-[0.625rem] border p-3 text-xs text-nowrap duration-300 ${
                        country === c
                          ? "border-transparent bg-primary-300 text-white"
                          : "border-[#626060] text-[#1e1e1e] hover:border-transparent hover:bg-primary-300/70 hover:text-white"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-300 py-3 text-sm font-semibold text-white duration-300 hover:bg-primary"
              >
                <Search className="size-4" />
                Search {tab === "programs" ? "Programs" : "Scholarships"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
