"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "What does Gramel Education do exactly?",
    answer:
      "Gramel Education is a full-service education management company. We help students apply to international schools, secure student loans or ISAs, apply for scholarships, get visa support, and prepare for departure.",
  },
  {
    question: "Which countries can I apply to through Gramel?",
    answer:
      "You can apply to schools in Canada, the UK, the US, Australia, and more. Through our global partners, you have access to over 1,500 accredited institutions worldwide.",
  },
  {
    question: "Do you only help university applicants?",
    answer:
      "No, we support students at all levels—from high school to university and beyond. Whether you're looking for undergraduate, graduate, or vocational programs, we can help you find the right fit.",
  },
  {
    question: "Can I get a student loan or financial aid through you?",
    answer:
      "Yes, we provide comprehensive financial support options. We help students secure low-interest student loans, income share agreements (ISAs), and scholarships to make studying abroad more affordable.",
  },
  {
    question: "Can Gramel help with visa processing?",
    answer:
      "Absolutely! We provide end-to-end visa support, including document preparation, interview coaching, and application submission. Our team ensures you have everything you need for a successful visa application.",
  },
];

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
