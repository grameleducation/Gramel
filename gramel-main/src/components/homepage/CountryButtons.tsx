export const countries = [
  "United States",
  "Canada",
  "Germany",
  "Australia",
  "Ireland",
  "New Zealand",
];

interface CountryButtonsProps {
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function CountryButtons({
  activeIndex,
  onSelect,
}: CountryButtonsProps) {
  return (
    <div className="mt-16 flex flex-nowrap justify-between gap-6 overflow-x-auto border-b border-[#626060] py-4">
      {countries.map((country, idx) => (
        <button
          key={country}
          onClick={() => onSelect(idx)}
          className={`rounded-2xl px-6 py-3 text-nowrap text-[#1e1e1e] duration-300 hover:text-white md:text-lg ${
            activeIndex === idx
              ? "bg-primary-300 text-white"
              : "hover:bg-primary-300/70"
          }`}
        >
          {country}
        </button>
      ))}
    </div>
  );
}
