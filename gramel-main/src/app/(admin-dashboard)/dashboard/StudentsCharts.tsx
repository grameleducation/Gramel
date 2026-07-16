"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Chart } from "@/lib/Chart";
import numeral from "numeral";
import type { AdminDashboardResponse, ServiceCode } from "./page";
import { LoaderIcon } from "lucide-react";

export function StudentDistributionByGenderChart({
  loading,
  data,
}: {
  loading: boolean;
  data: AdminDashboardResponse["gender_distribution"] | undefined;
}) {
  const genders = ["Male", "Female", "N/A"];
  // Order gender data
  const genderData = genders.map((gender) => {
    const count =
      data?.find((item) => item.gender.toLowerCase() === gender.toLowerCase())
        ?.count ?? 0;
    return { gender, count };
  });

  return (
    <Card className="relative my-6 w-full overflow-hidden rounded-2xl border-none shadow-md">
      {loading && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-white/50">
          <LoaderIcon className="size-10 animate-spin" />
        </div>
      )}
      <CardContent className="min-h-72">
        <Chart
          options={{
            chart: {
              toolbar: {
                show: true,
                export: {
                  csv: {
                    filename: "Student Enrollment",
                    headerCategory: "Month",
                  },
                  svg: { filename: "Student Enrollment" },
                  png: { filename: "Student Enrollment" },
                },
              },
              width: 380,
              zoom: { enabled: false },
              stacked: true,
            },
            title: { text: "Student Distribution by Gender" },
            dataLabels: { enabled: true },
            tooltip: {
              y: {
                formatter: (val, opts) => {
                  return `${numeral(val).format("0,0")} student${val > 1 ? "s" : ""}`;
                },
              },
            },
            colors: ["#09225a", "#62a9dc", "#efb100"],
            labels: genders,
            legend: {
              position: "bottom",
              fontSize: "14px",
              fontWeight: 400,
            },
          }}
          series={genderData.map((item) => item.count)}
          type="donut"
          height={450}
        />
      </CardContent>
    </Card>
  );
}

export function StudentDistributionByAgeChart({
  loading,
  data,
}: {
  loading: boolean;
  data: AdminDashboardResponse["age_distribution"] | undefined;
}) {
  const ageRange = ["0-19", "20-39", "40-59", "60-79", "80-99", "100+", "N/A"];
  // Order the age range
  const ageData = ageRange.map((range) => {
    const count =
      data?.find((item) => item.age_range.toLowerCase() === range.toLowerCase())
        ?.count ?? 0;
    return { range, count };
  });

  return (
    <Card className="relative my-6 w-full overflow-hidden rounded-2xl border-none shadow-md">
      {loading && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-white/50">
          <LoaderIcon className="size-10 animate-spin" />
        </div>
      )}
      <CardContent className="min-h-72">
        <Chart
          options={{
            chart: {
              toolbar: {
                show: true,
                export: {
                  csv: {
                    filename: "Student Age Distribution",
                    headerCategory: "Age Group",
                  },
                  svg: { filename: "Student Age Distribution" },
                  png: { filename: "Student Age Distribution" },
                },
              },
              zoom: { enabled: false },
              stacked: true,
            },
            title: { text: "Student Age Distribution" },
            dataLabels: { enabled: false },
            plotOptions: { bar: { columnWidth: "40%", borderRadius: 4 } },
            fill: { opacity: 1, colors: ["#09225a"] },
            tooltip: {
              y: {
                formatter: (val) =>
                  `${numeral(val).format("0,0")} student${val > 1 ? "s" : ""}`,
              },
            },
            grid: { strokeDashArray: 6, borderColor: "#E5E7EB" },
            xaxis: {
              categories: ageRange,
              title: { text: "Age Group" },
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { style: { colors: "#6B7280" } },
            },
            yaxis: {
              title: { text: "Number of Students" },
              labels: { style: { colors: "#6B7280" } },
              axisBorder: { show: false },
              axisTicks: { show: false },
            },
          }}
          series={[
            {
              name: "Students",
              data: ageData.map((item) => item.count),
            },
          ]}
          type="bar"
          height={450}
        />
      </CardContent>
    </Card>
  );
}

export function ApplicantsByServiceChart({
  loading,
  applicantsByService,
}: {
  loading: boolean;
  applicantsByService: Partial<Record<ServiceCode, number>>;
}) {
  const isMobile = useIsMobile();

  const services = [
    "Intl Admissions",
    "Doc Verification",
    "Scholarships",
    "Visa Assistance",
    "IELTS",
    "TOEFL",
    "GRE",
    "DTE",
    "PTE",
    "Student Loan",
    "Advisory Services",
  ];

  const applicants = [
    (applicantsByService.IADM1 ?? 0) + (applicantsByService.IADM2 ?? 0),
    applicantsByService.DOCV ?? 0,
    applicantsByService.SCHL ?? 0,
    applicantsByService.VISA ?? 0,
    applicantsByService.IELTS ?? 0,
    applicantsByService.TOEFL ?? 0,
    applicantsByService.GRE ?? 0,
    applicantsByService.DTE ?? 0,
    applicantsByService.PTE ?? 0,
    applicantsByService.LOAN ?? 0,
    applicantsByService.ADVS ?? 0,
  ];
  return (
    <Card className="relative my-6 w-full overflow-hidden rounded-2xl border-none shadow-md">
      {loading && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-white/50">
          <LoaderIcon className="size-10 animate-spin" />
        </div>
      )}
      <CardContent className="min-h-72">
        <Chart
          options={{
            chart: {
              toolbar: {
                show: true,
                export: {
                  csv: {
                    filename: "Applicants By Service",
                    headerCategory: "Service",
                  },
                  svg: { filename: "Applicants By Service" },
                  png: { filename: "Applicants By Service" },
                },
              },
              zoom: { enabled: false },
              stacked: true,
            },
            title: { text: "Applicants By Service" },
            dataLabels: { enabled: false },
            plotOptions: {
              bar: { columnWidth: isMobile ? "40%" : 40, borderRadius: 4 },
            },
            fill: { opacity: 1, colors: ["#62a9dc"] },
            tooltip: {
              y: {
                formatter: (val) =>
                  `${numeral(val).format("0,0")} applicant${val > 1 ? "s" : ""}`,
              },
            },
            grid: { strokeDashArray: 6, borderColor: "#E5E7EB" },
            xaxis: {
              categories: services,
              title: { text: "Service" },
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { style: { colors: "#6B7280" } },
            },
            yaxis: {
              title: { text: "Number of Applicants" },
              labels: { style: { colors: "#6B7280" } },
              axisBorder: { show: false },
              axisTicks: { show: false },
            },
          }}
          series={[
            {
              name: "Applicants",
              data: applicants,
            },
          ]}
          type="bar"
          height={450}
        />
      </CardContent>
      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-white/50">
          <LoaderIcon className="size-10 animate-spin" />
        </div>
      )}
    </Card>
  );
}

export function RevenueByServiceChart({
  loading,
  revenueByService,
}: {
  loading: boolean;
  revenueByService: Partial<Record<ServiceCode, number>>;
}) {
  const isMobile = useIsMobile();

  const services = [
    "Intl Admissions",
    "Doc Verification",
    "Scholarships",
    "Visa Assistance",
    "IELTS",
    "TOEFL",
    "GRE",
    "DTE",
    "PTE",
    "Student Loan",
    "Advisory Services",
  ];

  // Revenue data from stat cards (in kobo to naira)
  const revenues = [
    ((revenueByService.IADM1 ?? 0) + (revenueByService.IADM2 ?? 0)) / 100,
    (revenueByService.DOCV ?? 0) / 100,
    (revenueByService.SCHL ?? 0) / 100,
    (revenueByService.VISA ?? 0) / 100,
    (revenueByService.IELTS ?? 0) / 100,
    (revenueByService.TOEFL ?? 0) / 100,
    (revenueByService.GRE ?? 0) / 100,
    (revenueByService.DTE ?? 0) / 100,
    (revenueByService.PTE ?? 0) / 100,
    (revenueByService.LOAN ?? 0) / 100,
    (revenueByService.ADVS ?? 0) / 100,
  ];
  return (
    <Card className="relative my-6 w-full overflow-hidden rounded-2xl border-none shadow-md">
      {loading && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-white/50">
          <LoaderIcon className="size-10 animate-spin" />
        </div>
      )}
      <CardContent>
        <Chart
          options={{
            chart: {
              toolbar: {
                show: true,
                export: {
                  csv: {
                    filename: "Revenue By Service",
                    headerCategory: "Service",
                  },
                  svg: { filename: "Revenue By Service" },
                  png: { filename: "Revenue By Service" },
                },
              },
              zoom: { enabled: false },
              stacked: true,
            },
            title: { text: "Revenue By Service" },
            dataLabels: { enabled: false },
            plotOptions: {
              bar: { columnWidth: isMobile ? "40%" : 40, borderRadius: 4 },
            },
            fill: {
              opacity: 1,
              colors: ["#efb100"],
            },
            tooltip: {
              y: {
                formatter: (val) => `₦${numeral(val).format("0,0.00")}`,
              },
            },
            grid: { strokeDashArray: 6, borderColor: "#E5E7EB" },
            xaxis: {
              categories: services,
              title: { text: "Service" },
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { style: { colors: "#6B7280" } },
            },
            yaxis: {
              title: { text: "Revenue (₦)" },
              labels: { style: { colors: "#6B7280" } },
              axisBorder: { show: false },
              axisTicks: { show: false },
            },
          }}
          series={[
            {
              name: "Revenue",
              data: revenues,
            },
          ]}
          type="bar"
          height={450}
        />
      </CardContent>
    </Card>
  );
}
