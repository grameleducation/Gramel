"use client";
import { useState } from "react";

const countries = ["United States", "Australia", "Canada", "Germany"];

export default function QuickLocationButtons() {
  const [activeIndex, setActive] = useState(0);
  return (
    <div className="flex flex-nowrap gap-2.5 overflow-x-auto">
      {countries.map((country, index) => (
        <button
          key={index}
          type="button"
          onClick={() => setActive(index)}
          className={`rounded-[0.625rem] border border-[#626060] p-3 text-xs text-nowrap text-[#1e1e1e] duration-300 hover:border-transparent hover:text-white ${
            activeIndex === index
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
