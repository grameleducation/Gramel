"use client";

import {
  BookOpen,
  Database,
  FileCheck2,
  FileText,
  Globe,
  GraduationCap,
  Languages,
  Users,
  Award,
  Plane,
  HandCoins,
  MessageSquare,
  Users2,
} from "lucide-react";
import { StatCard } from "./StatCard";
import numeral from "numeral";
import {
  ApplicantsByServiceChart,
  RevenueByServiceChart,
  StudentDistributionByAgeChart,
  StudentDistributionByGenderChart,
} from "./StudentsCharts";
import { ServiceCode } from "./page";
import { nairaSign } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { useErrorToast } from "./toast";
import type { AdminDashboardResponse } from "./page";

async function getAdminDashboardStats(): Promise<AdminDashboardResponse> {
  const res = await fetch("/api/admin-dashboard/stats");
  const payload = await res.json();

  if (!res.ok || !payload.success) {
    throw new Error(payload.error || "Failed to load dashboard stats");
  }

  return payload.data;
}

export default function DashboardView() {
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getAdminDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
  });

  useErrorToast({
    description: "An error occured while loading dashboard data",
    refetch,
    error,
  });

  // Restructure data
  const totalStudents =
    data?.age_distribution.reduce((total, curr) => total + curr.count, 0) || 0;

  const applicantsByService: Partial<Record<ServiceCode, number>> =
    data?.applicants_by_service.reduce(
      (result, curr) => {
        result[curr.service_code] = curr.count;
        return result;
      },
      {} as Partial<Record<ServiceCode, number>>,
    ) || {};

  const revenueByService: Partial<Record<ServiceCode, number>> =
    data?.revenue_by_service.reduce(
      (result, curr) => {
        result[curr.service_code] = curr.total_revenue;
        return result;
      },
      {} as Partial<Record<ServiceCode, number>>,
    ) || {};

  const totalRevenue = Object.values(revenueByService).reduce(
    (total, curr) => total + curr,
    0,
  );

  return (
    <div className="px-6 md:px-8">
      {/* Key performance indicators - stats */}
      <section aria-label="Key performance indicators" className="">
        <h3 className="mb-2.5 text-lg font-semibold text-gray-700">
          Student Stats
        </h3>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {/* TODO: Fetch actual student stats */}
          <StatCard
            title="Total Students"
            loading={isFetching}
            value={numeral(totalStudents).format("0,0")}
            icon={<Users className="size-4" />}
            iconClassName="bg-primary-300/40 text-primary/70"
            info="Total number of students since platform inception"
          />
          <StatCard
            title="Unique Students with Applications"
            loading={isFetching}
            value={numeral(
              data?.student_stats.students_with_applications,
            ).format("0,0")}
            icon={<Users2 className="size-4" />}
            iconClassName="bg-indigo-200 text-indigo-700"
            info="Total number of unique students with applications since platform inception"
          />
          <StatCard
            title="International Admissions Applicants"
            loading={isFetching}
            value={numeral(
              (applicantsByService.IADM1 || 0) +
                (applicantsByService.IADM2 || 0),
            ).format("0,0")}
            icon={<Globe className="size-4" />}
            iconClassName="bg-blue-200 text-blue-700"
            info="Total number of international admissions applicants since platform inception"
          />
          <StatCard
            title="IELTS Applicants"
            loading={isFetching}
            value={numeral(applicantsByService.IELTS || 0).format("0,0")}
            icon={<Languages className="size-4" />}
            iconClassName="bg-emerald-200 text-emerald-700"
            info="Total number of IELTS applicants since platform inception"
          />
          <StatCard
            title="TOEFL Applicants"
            loading={isFetching}
            value={numeral(applicantsByService.TOEFL || 0).format("0,0")}
            icon={<BookOpen className="size-4" />}
            iconClassName="bg-amber-200 text-amber-700"
            info="Total number of TOEFL applicants since platform inception"
          />
          <StatCard
            title="GRE Applicants"
            loading={isFetching}
            value={numeral(applicantsByService.GRE || 0).format("0,0")}
            icon={<FileText className="size-4" />}
            iconClassName="bg-purple-200 text-purple-700"
            info="Total number of GRE applicants since platform inception"
          />
          <StatCard
            title="Duolingo English Test Applicants"
            loading={isFetching}
            value={numeral(applicantsByService.DTE || 0).format("0,0")}
            icon={<Languages className="size-4" />}
            iconClassName="bg-green-200 text-green-700"
            info="Number of Duolingo English Test applicants since platform inception"
          />
          <StatCard
            title="PTE Applicants"
            loading={isFetching}
            value={numeral(applicantsByService.PTE || 0).format("0,0")}
            icon={<GraduationCap className="size-4" />}
            iconClassName="bg-pink-200 text-pink-700"
            info="Total number of PTE applicants since platform inception"
          />
          {/* <StatCard
            title="Document Verification Applicants"
            loading={isFetching}
            value={numeral(applicantsByService.DOCV || 0).format("0,0")}
            icon={<FileCheck2 className="size-4" />}
            iconClassName="bg-green-200 text-green-700"
            info="Total number of applicants that applied for document verification since platform inception"
          /> */}
          {/* <StatCard
            title="Scholarship Applicants"
            loading={isFetching}
            value={numeral(applicantsByService.SCHL || 0).format("0,0")}
            icon={<Award className="size-4" />}
            iconClassName="bg-purple-200 text-purple-700"
            info="Total number of applicants that applied for scholarship since platform inception"
          /> */}
          {/* <StatCard
            title="Visa Assistance Applicants"
            loading={isFetching}
            value={numeral(applicantsByService.VISA || 0).format("0,0")}
            icon={<Plane className="size-4" />}
            iconClassName="bg-amber-200 text-amber-700"
            info="Total number of applicants that applied for visa assistance since platform inception"
          /> */}
          {/* <StatCard
            title="Student Loan Applicants"
            loading={isFetching}
            value={numeral(applicantsByService.LOAN || 0).format("0,0")}
            icon={<HandCoins className="size-4" />}
            iconClassName="bg-emerald-200 text-emerald-700"
            info="Total number of applicants that applied for student loan since platform inception"
          /> */}
          {/* <StatCard
            title="Advisory Services Applicants"
            loading={isFetching}
            value={numeral(applicantsByService.ADVS || 0).format("0,0")}
            icon={<MessageSquare className="size-4" />}
            iconClassName="bg-indigo-200 text-indigo-700"
            info="Total number of applicants that applied for advisory services since platform inception"
          /> */}
        </div>
      </section>

      {/* Students Charts */}
      <section className="mt-8">
        <div className="grid gap-6 xl:grid-cols-[2fr_3fr]">
          <StudentDistributionByGenderChart
            loading={isFetching}
            data={data?.gender_distribution}
          />
          <StudentDistributionByAgeChart
            loading={isFetching}
            data={data?.age_distribution}
          />
        </div>
        <ApplicantsByServiceChart
          loading={isFetching}
          applicantsByService={applicantsByService}
        />
      </section>

      {/* Revenue Breakdown */}
      <section aria-label="Revenue Breakdown" className="mt-12">
        <h3 className="mb-2.5 text-lg font-semibold text-gray-700">
          Revenue Breakdown
        </h3>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {/* TODO: Fetch actual revenue data */}
          <StatCard
            title="Total Revenue"
            loading={isFetching}
            value={nairaSign + numeral(totalRevenue / 100).format("0,0.00")}
            icon={<Database className="size-4" />}
            iconClassName="bg-yellow-200 text-yellow-700"
            info="Total revenue since platform inception"
          />
          <StatCard
            title="International Admissions Revenue"
            loading={isFetching}
            value={
              nairaSign +
              numeral(
                ((revenueByService.IADM1 || 0) +
                  (revenueByService.IADM2 || 0)) /
                  100,
              ).format("0,0.00")
            }
            icon={<Globe className="size-4" />}
            iconClassName="bg-blue-200 text-blue-700"
            info="Revenue from international admissions applicants"
          />
          <StatCard
            title="IELTS Revenue"
            loading={isFetching}
            value={
              nairaSign +
              numeral((revenueByService.IELTS || 0) / 100).format("0,0.00")
            }
            icon={<Languages className="size-4" />}
            iconClassName="bg-emerald-200 text-emerald-700"
            info="Revenue from IELTS applicants"
          />
          <StatCard
            title="TOEFL Revenue"
            loading={isFetching}
            value={
              nairaSign +
              numeral(revenueByService.TOEFL || 0 / 100).format("0,0.00")
            }
            icon={<BookOpen className="size-4" />}
            iconClassName="bg-amber-200 text-amber-700"
            info="TOEFL applicants Revenue"
          />
          <StatCard
            title="GRE Revenue"
            loading={isFetching}
            value={
              nairaSign +
              numeral((revenueByService.GRE || 0) / 100).format("0,0.00")
            }
            icon={<FileText className="size-4" />}
            iconClassName="bg-purple-200 text-purple-700"
            info="Revenue from GRE applicants"
          />
          <StatCard
            title="Duolingo English Test Revenue"
            loading={isFetching}
            value={
              nairaSign +
              numeral((revenueByService.DTE || 0) / 100).format("0,0.00")
            }
            icon={<Languages className="size-4" />}
            iconClassName="bg-green-200 text-green-700"
            info="Revenue from Duolingo English Test applicants"
          />
          <StatCard
            title="PTE Revenue"
            loading={isFetching}
            value={
              nairaSign +
              numeral((revenueByService.PTE || 0) / 100).format("0,0.00")
            }
            icon={<GraduationCap className="size-4" />}
            iconClassName="bg-pink-200 text-pink-700"
            info="Revenue from PTE applicants"
          />
          {/* <StatCard
            title="Document Verification Revenue"
            loading={isFetching}
            value={
              nairaSign + numeral(revenueByService.DOCV || 0).format("0,0.00")
            }
            icon={<FileCheck2 className="size-4" />}
            iconClassName="bg-green-200 text-green-700"
            info="Revenue from document verification applicants"
          /> */}
          {/* <StatCard
            title="Scholarship Revenue"
            loading={isFetching}
            value={
              nairaSign + numeral(revenueByService.SCHL || 0).format("0,0.00")
            }
            icon={<Award className="size-4" />}
            iconClassName="bg-purple-200 text-purple-700"
            info="Revenue from scholarship applicants"
          /> */}
          {/* <StatCard
            title="Visa Assistance Revenue"
            loading={isFetching}
            value={
              nairaSign + numeral(revenueByService.VISA || 0).format("0,0.00")
            }
            icon={<Plane className="size-4" />}
            iconClassName="bg-amber-200 text-amber-700"
            info="Revenue from visa assistance applicants"
          /> */}
          {/* <StatCard
            title="Student Loan Revenue"
            loading={isFetching}
            value={
              nairaSign + numeral(revenueByService.LOAN || 0).format("0,0.00")
            }
            icon={<HandCoins className="size-4" />}
            iconClassName="bg-emerald-200 text-emerald-700"
            info="Revenue from student loan applicants"
          /> */}
          {/* <StatCard
            title="Advisory Services Revenue"
            loading={isFetching}
            value={
              nairaSign + numeral(revenueByService.ADVS || 0).format("0,0.00")
            }
            icon={<MessageSquare className="size-4" />}
            iconClassName="bg-indigo-200 text-indigo-700"
            info="Revenue from advisory services applicants"
          /> */}
        </div>
      </section>

      {/* Revenue By Service Chart */}
      <section className="mt-12">
        <RevenueByServiceChart
          loading={isFetching}
          revenueByService={revenueByService}
        />
      </section>
    </div>
  );
}
