"use client";

import { motion } from "framer-motion";
import useCountUp from "@/hooks/useCountUp";

interface ServiceStat {
  value: string;
  label: string;
  className?: string;
}

const stats: ServiceStat[] = [
  { value: "1200+", label: "Admissions Processed" },
  {
    value: "200+",
    label: "Prometric Exam Registrations Managed",
    className: "mx-auto max-w-2xs",
  },
  { value: "3000+", label: "Successful Student Visas" },
  { value: "98%", label: "Satisfaction Rate" },
];

export default function ServicesStats() {
  return (
    <div className="grid grid-cols-1 items-center gap-6 xs:grid-cols-2 md:grid-cols-4 xl:grid-cols-1 xl:gap-7">
      {stats.map((stat) => {
        const { ref, prefix, formatted, showSuffix } = useCountUp(stat.value);
        return (
          <div
            key={stat.label}
            className="space-y-2.5 text-center xl:text-left"
          >
            <h4 className="text-4xl font-bold text-primary-300 xl:text-5xl">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                ref={ref}
              >{`${prefix}${formatted}${showSuffix}`}</motion.span>
            </h4>
            <p
              className={`font-semibold text-[#040018] md:text-xl ${stat.className || ""}`}
            >
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
