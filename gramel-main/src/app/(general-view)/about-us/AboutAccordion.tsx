"use client";

import { useState } from "react";

const ACCORDION_DATA = [
  {
    title: "Global Reach, Local Support",
    content: `We partner with over 1,500 institutions across Canada, the UK, USA, Australia, and beyond—through ApplyBoard and other trusted platforms. At the same time, we offer local advisors who understand your unique background, cultural context, and personal goals.`,
  },
  {
    title: "Student-Centered, Results-Driven",
    content: `Our approach is tailored to each student, focusing on your aspirations and outcomes. We measure our success by your achievements—whether it's gaining admission, securing scholarships, or thriving in a new country.`,
  },
];

export default function AboutAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-5">
      {ACCORDION_DATA.map((item, idx) => {
        const isActive = idx === activeIndex;
        return (
          <div
            key={item.title}
            className={`transition-colors duration-300 ${idx === ACCORDION_DATA.length - 1 ? "border-y border-[#dee2e5] py-5" : ""}`}
          >
            <button
              type="button"
              className="flex w-full items-center gap-2.5 focus:outline-none max-lg:justify-center"
              onClick={() => setActiveIndex(idx)}
              aria-expanded={isActive}
              aria-controls={`about-accordion-panel-${idx}`}
            >
              <svg
                width="20px"
                height="20px"
                fill="none"
                viewBox="0 0 20 20"
                className={`duration-300 ${isActive ? "" : "rotate-90"}`}
              >
                <path
                  d="M10 2v16M10 2l-4 4m4-4l4 4"
                  stroke="#040610"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3
                className={`text-center text-xl font-semibold transition-colors duration-300 md:text-2xl ${isActive ? "text-primary" : "text-[#040610]"}`}
              >
                {item.title}
              </h3>
            </button>
            <div
              id={`about-accordion-panel-${idx}`}
              className={`grid transition-all duration-300 ${isActive ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              style={{ overflow: "hidden" }}
            >
              <div className="overflow-hidden text-[#5c6c7b] max-lg:text-center">
                <p>{item.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
