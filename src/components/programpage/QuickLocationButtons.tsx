"use client";

const countries = ["United States", "Australia", "Canada", "Germany"];

// Sets the shared "country" filter input (by id) and submits the enclosing
// form, so these act as one-click shortcuts for the same field the
// Destination select controls.
export default function QuickLocationButtons({
  countryInputId,
  activeCountry,
}: {
  countryInputId: string;
  activeCountry?: string;
}) {
  const handleClick = (country: string) => {
    const input = document.getElementById(
      countryInputId,
    ) as HTMLInputElement | null;
    if (!input) return;

    input.value = country;
    input.closest("form")?.requestSubmit();
  };

  return (
    <div className="flex flex-nowrap gap-2.5 overflow-x-auto">
      {countries.map((country) => (
        <button
          key={country}
          type="button"
          onClick={() => handleClick(country)}
          className={`rounded-[0.625rem] border border-[#626060] p-3 text-xs text-nowrap text-[#1e1e1e] duration-300 hover:border-transparent hover:text-white ${
            activeCountry === country
              ? "border-transparent bg-primary-300 text-white"
              : "hover:bg-primary-300/70"
          }`}
        >
          {country}
        </button>
      ))}
    </div>
  );
}
