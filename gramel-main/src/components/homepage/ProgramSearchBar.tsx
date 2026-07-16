import { ChevronDown } from "lucide-react";

export default function ProgramSearchBar() {
  return (
    <div className="relative z-20 mx-auto -mt-40 max-w-screen-2xl px-6 md:px-12 lg:-mt-20 xl:px-25">
      <form className="flex flex-col justify-center gap-4 rounded-2xl bg-primary/70 px-4 py-9 backdrop-blur-xs md:justify-between md:px-12.5 lg:flex-row lg:max-xl:gap-2 lg:max-xl:px-6">
        {/* Country */}
        <div className="grid grow gap-4 border-[#d9d9d9] sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_2fr] lg:border-r lg:pr-4 lg:max-xl:grid-cols-[2fr_2fr_2fr_3fr] lg:max-xl:gap-2 lg:max-xl:pr-2">
          <div className="relative w-full">
            <input
              type="text"
              list="countries"
              placeholder="Select Country"
              className="peer w-full rounded-[0.625rem] border border-white/60 bg-white/30 p-4 font-semibold text-white placeholder-white duration-300 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <datalist id="countries">
              <option value="Canada" />
              <option value="Germany" />
              <option value="Nigeria" />
              <option value="United Kingdom" />
              <option value="United States" />
            </datalist>

            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-white duration-150 peer-hover:pointer-events-none peer-hover:opacity-0 peer-focus:pointer-events-none peer-focus:opacity-0" />
          </div>
          {/* University */}
          <div className="relative w-full">
            <input
              type="text"
              list="universities"
              placeholder="Select University"
              className="peer w-full rounded-[0.625rem] border border-white/60 bg-white/30 p-4 font-semibold text-white placeholder-white duration-300 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <datalist id="universities">
              <option value="Harvard" />
              <option value="MIT" />
              <option value="University of Lagos" />
              <option value="Oxford" />
              <option value="Toronto" />
            </datalist>

            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-white duration-150 peer-hover:pointer-events-none peer-hover:opacity-0 peer-focus:pointer-events-none peer-focus:opacity-0" />
          </div>
          {/* Program */}
          <div className="relative w-full">
            <input
              type="text"
              list="programs"
              placeholder="Choose Program"
              className="peer w-full rounded-[0.625rem] border border-white/60 bg-white/30 p-4 font-semibold text-white placeholder-white duration-300 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <datalist id="programs">
              <option value="Engineering" />
              <option value="Medicine" />
              <option value="Law" />
              <option value="Business" />
              <option value="Art" />
            </datalist>

            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-white duration-150 peer-hover:pointer-events-none peer-hover:opacity-0 peer-focus:pointer-events-none peer-focus:opacity-0" />
          </div>
          {/* Subject Search */}
          <input
            type="text"
            placeholder="Enter course subject"
            className="w-full rounded-[0.625rem] bg-black/50 p-4 px-6 font-semibold text-white placeholder-white duration-300 focus:ring-2 focus:ring-white focus:outline-none"
          />
        </div>
        {/* Search Button */}
        <button
          type="submit"
          className="rounded-md bg-white p-4 px-6 font-semibold text-[#012444] duration-300 hover:bg-white/90"
        >
          Search
        </button>
      </form>
    </div>
  );
}
