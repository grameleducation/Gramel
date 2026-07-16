"use client";

import React from "react";
import { motion } from "framer-motion";
import useCountUp from "@/hooks/useCountUp";

const stats = [
  { value: "500+", label: "Students graduated" },
  { value: "97%", label: "Student satisfaction rate" },
  { value: "200+", label: "International Programs" },
  { value: "$3.2M", label: "Scholarships Secured" },
];

export default function AboutUsStats() {
  return (
    <div className="flex flex-col flex-wrap items-center justify-between gap-8 text-white xs:flex-row xs:gap-0">
      {stats.map((stat, index) => {
        const { ref, prefix, formatted, showSuffix } = useCountUp(stat.value);
        return (
          <React.Fragment key={stat.label}>
            {index > 0 && (
              <div
                className={`hidden h-12 w-px bg-gradient-to-b from-white/0 via-white to-white/0 ${index === 2 ? "lg:block" : "sm:block"}`}
              />
            )}

            <div className="flex w-[calc(50%-2px)] justify-center lg:w-auto">
              <div className="space-y-1 text-center lg:text-left">
                <div className="text-5xl font-medium md:text-[4rem]">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span
                      ref={ref}
                    >{`${prefix}${formatted}${showSuffix}`}</span>
                  </motion.span>
                </div>
                <div className="text-sm text-[#E6E6EB] md:text-lg">
                  {stat.label}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
