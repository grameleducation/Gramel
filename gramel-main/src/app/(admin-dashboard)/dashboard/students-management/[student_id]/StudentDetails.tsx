"use client";

import {
  ChevronDown,
  User,
  GraduationCap,
  School,
  BookOpen,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Users,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import copyToClipboard from "@/utils/copyToClipboard";
import { RoundCopyAll } from "@/lib/icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import DownloadDropDown from "./DownloadDropDown";
import { StudentData } from "./types";
import { Nullable } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { formatDate } from "./utils";
import { RequirePermission } from "@/components/auth/RequirePermission";
import { useAuthContext } from "@/context/AuthContext";
import { UserActions } from "@/lib/permissions/role";
import AssignStudentToAnotherStaffDialogue from "../components/AssignStudentToAnotherStaffDialogue";
import { useState } from "react";

export default function StudentDetails({
  student_id,
  studentData,
}: {
  student_id: string;
  studentData: StudentData;
}) {
  const { user } = useAuthContext();
  const [
    openAssignStudentToAnotherStaffDialogue,
    setOpenAssignStudentToAnotherStaffDialogue,
  ] = useState(false);
  const assigned_staff = studentData.assigned_staff;
  return (
    <>
      {/* Regular page content - hidden during print */}
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-primary">
          STUDENT
        </h1>

        <div className="mb-8">
          <div className="flex items-start justify-between gap-1">
            {/* Student name and ID */}
            <h2 className="text-2xl font-bold text-primary-300">
              {studentData.first_name} {studentData.middle_name}{" "}
              {studentData.last_name}
            </h2>

            <DownloadDropDown studentData={studentData} />
          </div>

          <p className="text-gray-600">
            <strong>Student ID: </strong> {student_id}
          </p>
          {/* Assigned staff. Only for admin */}
          <RequirePermission
            role={user?.role}
            action={UserActions.view_admin_staff_management}
          >
            <div className="flex cursor-pointer flex-wrap items-center gap-2 lg:gap-4">
              <p className="text-gray-600">
                <strong>Assigned Staff: </strong>
                {assigned_staff ? (
                  <>
                    {assigned_staff.first_name} {assigned_staff.middle_name}{" "}
                    {assigned_staff.last_name}
                    {assigned_staff.id === user?.id ? (
                      <strong> (Yourself)</strong>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  <span className="text-sm font-semibold text-red-500">
                    No assigned staff
                  </span>
                )}
              </p>
              <Button
                size="sm"
                className="h-auto py-1 font-bold hover:bg-primary-300"
                onClick={() => setOpenAssignStudentToAnotherStaffDialogue(true)}
              >
                Assign student to {assigned_staff ? "another" : "a"} staff
              </Button>
            </div>
          </RequirePermission>
        </div>

        {/* Collapsible to hide/show student details at will */}
        <Collapsible
          className="rounded-sm border border-transparent transition-colors data-[state=closed]:-mb-16 data-[state=closed]:border-gray-400"
          defaultOpen
        >
          <CollapsibleTrigger className="group flex w-full cursor-pointer items-center">
            <ChevronDown
              size={32}
              className="font-bold text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180"
            />
            <h2 className="text-xl font-semibold text-gray-700">
              Student Details
            </h2>
            <div className="h-[0.125rem] grow bg-gray-200"></div>
          </CollapsibleTrigger>
          {/* Student profile picture and details container */}
          <CollapsibleContent className="CollapsibleContent mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto]">
            {/* Student profile picture */}
            <Card className="size-50 justify-self-center overflow-hidden rounded-2xl bg-gray-200 p-0 lg:order-1 lg:size-55">
              {studentData.profile_picture_url ? (
                <Image
                  src={studentData.profile_picture_url}
                  alt="Student Image"
                  className="h-full w-full object-cover object-center"
                  width={200}
                  height={200}
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl">
                  👤
                </div>
              )}
            </Card>

            {/* Student details */}
            <div className="space-y-8">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="size-5 text-primary-300" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <DetailField
                    label="First Name"
                    value={studentData.first_name}
                  />
                  <DetailField
                    label="Last Name"
                    value={studentData.last_name}
                  />
                  <DetailField
                    label="Middle Name"
                    value={studentData.middle_name}
                  />
                  <DetailField
                    label="Date of Birth"
                    value={formatDate(studentData.date_of_birth)}
                    icon={<Calendar className="size-4" />}
                  />
                  <DetailField label="Gender" value={studentData.gender} />
                  <DetailField
                    label="Marital Status"
                    value={studentData.marital_status}
                  />
                  <DetailField
                    label="Phone Number"
                    value={studentData.phone}
                    icon={<Phone className="size-4" />}
                  />
                  <DetailField
                    label="Email Address"
                    value={studentData.email}
                    icon={<Mail className="size-4" />}
                  />
                  <DetailField
                    label="Passport Number"
                    value={studentData.passport_no}
                  />
                  <DetailField
                    label="Passport Expiry Date"
                    value={formatDate(studentData.passport_expiry_date)}
                    icon={<Calendar className="size-4" />}
                  />
                  <DetailField
                    label="Address"
                    value={studentData.address}
                    icon={<MapPin className="size-4" />}
                  />
                </CardContent>
              </Card>

              {/* Next of Kin Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="size-5 text-primary-300" />
                    Next of Kin Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <DetailField
                    label="Name"
                    value={studentData.next_of_kin.name}
                  />
                  <DetailField
                    label="Phone Number"
                    value={studentData.next_of_kin.phone}
                    icon={<Phone className="size-4" />}
                  />
                  <DetailField
                    label="Email Address"
                    value={studentData.next_of_kin.email}
                    icon={<Mail className="size-4" />}
                  />
                  <DetailField
                    label="Address"
                    value={studentData.next_of_kin.address}
                    icon={<MapPin className="size-4" />}
                  />
                </CardContent>
              </Card>

              {/* Education Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="size-5 text-primary-300" />
                    Education Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <DetailField
                    label="Highest Education"
                    value={studentData.highest_education}
                  />
                  <DetailField
                    label="Country"
                    value={studentData.highest_edu_country}
                  />
                  <DetailField
                    label="Grading Scale"
                    value={studentData.highest_edu_grading_scale}
                  />
                  <DetailField
                    label="Grade Average"
                    value={studentData.highest_edu_grade_average}
                  />
                </CardContent>
              </Card>

              {/* Higher Institution Education */}
              {studentData.higher_institutions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <School className="size-5 text-primary-300" />
                      Higher Institution Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {studentData.higher_institutions.map(
                      (institution, index) => (
                        <div
                          key={index}
                          className="border-b pb-6 last:border-b-0 last:pb-0"
                        >
                          {studentData.higher_institutions.length > 1 && (
                            <h4 className="mb-4 font-semibold text-primary-300">
                              Institution {index + 1}
                            </h4>
                          )}
                          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <DetailField
                              label="Institution Name"
                              value={institution.name}
                            />
                            <DetailField
                              label="Country"
                              value={institution.country}
                            />
                            <DetailField
                              label="City"
                              value={institution.city}
                            />
                            <DetailField
                              label="Attended From"
                              value={formatDate(institution.attended_from)}
                              icon={<Calendar className="size-4" />}
                            />
                            <DetailField
                              label="Attended To"
                              value={formatDate(institution.attended_to)}
                              icon={<Calendar className="size-4" />}
                            />
                            <DetailField
                              label="Graduation Date"
                              value={formatDate(institution.graduation_date)}
                              icon={<Calendar className="size-4" />}
                            />
                          </div>
                        </div>
                      ),
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Secondary School Education */}
              {studentData.secondary_schools.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="size-5 text-primary-300" />
                      Secondary School Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {studentData.secondary_schools.map((school, index) => (
                      <div
                        key={index}
                        className="border-b pb-6 last:border-b-0 last:pb-0"
                      >
                        {studentData.secondary_schools.length > 1 && (
                          <h4 className="mb-4 font-semibold text-primary-300">
                            School {index + 1}
                          </h4>
                        )}
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                          <DetailField
                            label="School Name"
                            value={school.name}
                          />
                          <DetailField label="Country" value={school.country} />
                          <DetailField label="City" value={school.city} />
                          <DetailField
                            label="Attended From"
                            value={formatDate(school.attended_from)}
                            icon={<Calendar className="size-4" />}
                          />
                          <DetailField
                            label="Attended To"
                            value={formatDate(school.attended_to)}
                            icon={<Calendar className="size-4" />}
                          />
                          <DetailField
                            label="Graduation Date"
                            value={formatDate(school.graduation_date)}
                            icon={<Calendar className="size-4" />}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Other Education */}
              {studentData.other_education.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="size-5 text-primary-300" />
                      Other Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {studentData.other_education.map((education, index) => (
                      <div
                        key={index}
                        className="border-b pb-6 last:border-b-0 last:pb-0"
                      >
                        {studentData.other_education.length > 1 && (
                          <h4 className="mb-4 font-semibold text-primary-300">
                            Institution {index + 1}
                          </h4>
                        )}
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                          <DetailField
                            label="Institution Name"
                            value={education.name}
                          />
                          <DetailField
                            label="Country"
                            value={education.country}
                          />
                          <DetailField label="City" value={education.city} />
                          <DetailField
                            label="Attended From"
                            value={formatDate(education.attended_from)}
                            icon={<Calendar className="size-4" />}
                          />
                          <DetailField
                            label="Attended To"
                            value={formatDate(education.attended_to)}
                            icon={<Calendar className="size-4" />}
                          />
                          <DetailField
                            label="Graduation Date"
                            value={formatDate(education.graduation_date)}
                            icon={<Calendar className="size-4" />}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <RequirePermission
        role={user?.role}
        action={UserActions.view_admin_staff_management}
      >
        <AssignStudentToAnotherStaffDialogue
          open={openAssignStudentToAnotherStaffDialogue}
          student={studentData}
          onClose={() => setOpenAssignStudentToAnotherStaffDialogue(false)}
        />
      </RequirePermission>

      {/* Placeholder print section for built-in printing */}
      <section className="hidden print:block">
        <h1 className="text-center text-2xl font-bold text-red-500">
          Use the Print button on the page to print this document or use the
          shortcut Ctrl+P (Windows) / ⌘+P (Mac)
        </h1>
      </section>
    </>
  );
}

interface DetailFieldProps {
  label: string;
  value: Nullable<string>;
  icon?: React.ReactNode;
}

function DetailField({ label, value, icon }: DetailFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon && <span className="text-primary-300">{icon}</span>}
        <label className="text-sm font-medium text-gray-600">{label}</label>
      </div>
      <p className="group flex items-center justify-between rounded-lg border bg-gray-50 px-3 py-2 text-base text-gray-900">
        <span className="group-has-[.clipboard:hover]:bg-blue-200">
          {value || "-"}
        </span>

        {value && value !== "-" && (
          <Tooltip>
            <TooltipTrigger
              className="clipboard flex h-7 cursor-pointer items-center gap-2 rounded-sm bg-white px-1.5 shadow"
              onClick={() => copyToClipboard(value)}
            >
              <RoundCopyAll className="size-5 text-gray-600" />
            </TooltipTrigger>
            <TooltipContent className="print:hidden">
              Copy {label.toLowerCase()} to clipboard
            </TooltipContent>
          </Tooltip>
        )}
      </p>
    </div>
  );
}
