"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqData } from "@/data/faq";

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="mt-16 space-y-6">
      {faqData.map((faq, index) => (
        <div
          key={index}
          onClick={() => setActiveIndex(activeIndex === index ? null : index)}
          className={`mx-auto max-w-4xl cursor-pointer rounded-3xl border border-[#8F8F923D] p-6 shadow-sm transition-colors duration-300 ${activeIndex === index ? "bg-neutral-50" : ""}`}
        >
          <h3 className="flex items-center justify-between gap-6 font-semibold text-neutral-500 md:text-2xl">
            {faq.question}
            <ChevronDown
              className={`size-8 shrink-0 transition-transform duration-300 ${activeIndex === index ? "rotate-180" : ""}`}
            />
          </h3>
          <div
            className={`grid duration-300 ${activeIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          >
            <div className="overflow-hidden">
              <p className="pt-4 text-neutral-300 lg:text-lg">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
