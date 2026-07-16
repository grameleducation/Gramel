import { redirect } from "next/navigation";
import StudentDetails from "./StudentDetails";
import { hasPermission } from "@/lib/permissions/utils";
import { UserActions } from "@/lib/permissions/role";
import { PaymentTransaction, StudentData } from "./types";
import Link from "next/link";
import tryCatch from "@/utils/tryCatch";
import { auth } from "@/utils/better-auth/auth";
import { headers } from "next/headers";
import { isUserRole } from "@/utils/isUserRoles";
import pool from "@/utils/db";
import CreateOfflinePaymentDialog from "./CreateOfflinePaymentDialog";
import StaffViewPaymentHistoryTable from "./StaffViewPaymentHistoryTable";

async function fetchStudentData(student_id: string) {
  const queryResult = await pool.query<
    StudentData & {
      payment_transactions: (Pick<
        PaymentTransaction,
        | "service"
        | "amount"
        | "paid_at"
        | "transaction_reference"
        | "payment_type"
        | "proof_of_payment"
      > & {
        created_by: {
          id: string;
          first_name: string;
          middle_name: string;
          last_name: string;
        } | null;
      })[];
    }
  >(
    `select u.id, u.first_name, u.last_name, u.middle_name, u.email, u.date_of_birth, u.passport_no, u.passport_expiry_date, u.gender, u.marital_status, u.address, u.phone, u.profile_picture_url, u.highest_education, u.highest_edu_country, u.highest_edu_grading_scale, u.highest_edu_grade_average, u.next_of_kin, u.higher_institutions, u.secondary_schools, u.other_education,

    -- assigned staff
    case
      when s.id is null then null
      else jsonb_build_object(
        'id', s.id, 'first_name', s.first_name, 'middle_name', s.middle_name, 'last_name', s.last_name
      )
    end as assigned_staff,

    -- payment transactions (ordered array)
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'service', pt.service,
          'amount', pt.amount,
          'paid_at', pt.paid_at,
          'transaction_reference', pt.transaction_reference,
          'payment_type', pt.payment_type,
          'proof_of_payment', pt.proof_of_payment,

          -- created_by as user object
          'created_by',
            case
              when cb.id is null then null
              else jsonb_build_object(
                'id', cb.id,
                'first_name', cb.first_name,
                'middle_name', cb.middle_name,
                'last_name', cb.last_name
              )
            end
        ) order by pt.paid_at desc
      ) filter (where pt.id is not null),
      '[]'::jsonb
    ) as payment_transactions

    from public.users u
    left join public.users s on s.id = u.assigned_staff_id
    left join public.payment_transactions pt on pt.user_id = u.id and pt.status = 'completed'
    left join public.users cb on cb.id = pt.created_by
    where u.id = $1
    group by u.id, s.id;`,
    [student_id],
  );

  return queryResult.rows[0];
}

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ student_id?: string }>;
}) {
  const { student_id } = await params;
  if (!student_id) redirect("/dashboard/students-management");

  const [result, sessionError] = await tryCatch(async () =>
    auth.api.getSession({ headers: await headers() }),
  );
  if (sessionError) redirect("/");
  if (!result?.user) redirect("/login");

  const user = result.user;
  // Check user permission
  if (
    !isUserRole(user.role) ||
    !hasPermission(user.role, UserActions.view_student_profile_as_admin)
  ) {
    redirect("/");
  }

  const [studentData, studentError] = await tryCatch(() =>
    fetchStudentData(student_id),
  );

  if (studentError) {
    return (
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-light-gray px-6 pt-6 pb-8 md:px-8">
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-medium text-red-500">
            An error occured getting student details
          </h1>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard/students-management"
              className="mt-2 rounded-md border border-red-500 px-4 py-2 text-red-500 transition-colors duration-200 hover:bg-red-100"
              prefetch={false}
            >
              Go Back
            </Link>
            <Link
              href={`/dashboard/students-management/${student_id}`}
              className="mt-2 cursor-pointer rounded-md bg-red-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-600"
              prefetch={false}
            >
              Retry
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-light-gray px-6 pt-6 pb-8 md:px-8 print:hidden">
      <StudentDetails student_id={student_id} studentData={studentData || {}} />

      <div className="mx-auto mt-20 max-w-7xl">
        <div className="mb-2 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Student Payment History
          </h2>
          <CreateOfflinePaymentDialog studentData={studentData} />
        </div>

        <div className="">
          <StaffViewPaymentHistoryTable
            payments={
              studentData.payment_transactions.map((payment) => ({
                ...payment,
                // Turn created_by into a string
                created_by: payment.created_by
                  ? `${payment.created_by.first_name ?? ""} ${
                      payment.created_by.middle_name ?? ""
                    } ${payment.created_by.last_name ?? ""} ${
                      user.id === payment.created_by.id ? "(Yourself)" : ""
                    }`
                  : "",
              })) || []
            }
          />
        </div>
      </div>
    </main>
  );
}
