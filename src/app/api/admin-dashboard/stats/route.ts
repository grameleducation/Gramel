import { NextResponse } from "next/server";
import { auth } from "@/utils/better-auth/auth";
import { UserActions } from "@/lib/permissions/role";
import pool from "@/utils/db";
import tryCatch from "@/utils/tryCatch";
import { isUserRole } from "@/utils/isUserRoles";
import { hasPermission } from "@/lib/permissions/utils";

// This endpoint get the stats for admin dashboard
export async function GET(request: Request) {
  const userRole = (session.user as any).role || "student";
  const [session, sessionError] = await tryCatch(async () =>
    auth.api.getSession({ headers: request.headers }),
  );

  if (sessionError || !session?.user) {
    return NextResponse.json(
      { success: false, error: "You must be logged in to perform this action" },
      { status: 401 },
    );
  }
  const userRole = (session.user as any).role || "student";

  if (
    !isUserRole(userRole) ||
    !hasPermission(userRole, UserActions.view_admin_dashboard)
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "You are not authorized to perform this action",
      },
      { status: 403 },
    );
  }

  const [res, queryError] = await tryCatch(() =>
    pool.query(`
      WITH student_data AS (
      SELECT id, gender,
        CASE
          WHEN date_of_birth IS NULL THEN 'N/A'
          WHEN EXTRACT(YEAR FROM age(date_of_birth)) BETWEEN 0 AND 19 THEN '0-19'
          WHEN EXTRACT(YEAR FROM age(date_of_birth)) BETWEEN 20 AND 39 THEN '20-39'
          WHEN EXTRACT(YEAR FROM age(date_of_birth)) BETWEEN 40 AND 59 THEN '40-59'
          WHEN EXTRACT(YEAR FROM age(date_of_birth)) BETWEEN 60 AND 79 THEN '60-79'
          WHEN EXTRACT(YEAR FROM age(date_of_birth)) BETWEEN 80 AND 99 THEN '80-99'
          WHEN EXTRACT(YEAR FROM age(date_of_birth)) >= 100 THEN '100+'
          ELSE 'N/A'
        END AS age_group
      FROM public.users
      WHERE role = 'student'
    ),
    transaction_data AS (
      SELECT user_id, service_code, amount
      FROM public.payment_transactions
      WHERE status = 'completed'
    ),
    gender_distribution AS (
      SELECT COALESCE(gender, 'N/A') AS gender_group, COUNT(*) AS count
      FROM student_data
      GROUP BY gender_group
    ),
    age_distribution AS (
      SELECT age_group, COUNT(*) AS count
      FROM student_data
      GROUP BY age_group
    ),
    applicants_by_service AS (
      SELECT service_code, COUNT(*) AS count
      FROM transaction_data
      GROUP BY service_code
    ),
    revenue_by_service AS (
      SELECT service_code, SUM(amount) AS total_revenue
      FROM transaction_data
      GROUP BY service_code
    ),
    student_stats AS (
      SELECT COUNT(DISTINCT user_id) AS students_with_applications
      FROM transaction_data
    )
    SELECT json_build_object(
      'student_stats', (SELECT row_to_json(student_stats) FROM student_stats),
      'gender_distribution', COALESCE(
        (SELECT json_agg(json_build_object('gender', gender_group, 'count', count)) FROM gender_distribution),
        '[]'::json
      ),
      'age_distribution', COALESCE(
        (SELECT json_agg(json_build_object('age_range', age_group, 'count', count)) FROM age_distribution),
        '[]'::json
      ),
      'applicants_by_service', COALESCE(
        (SELECT json_agg(json_build_object('service_code', service_code, 'count', count)) FROM applicants_by_service),
        '[]'::json
      ),
      'revenue_by_service', COALESCE(
        (SELECT json_agg(json_build_object('service_code', service_code, 'total_revenue', total_revenue)) FROM revenue_by_service),
        '[]'::json
      )
    ) AS dashboard_stats;`),
  );

  if (queryError) {
    return NextResponse.json(
      { success: false, error: "Failed to load dashboard stats" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: res.rows[0].dashboard_stats,
  });
}
