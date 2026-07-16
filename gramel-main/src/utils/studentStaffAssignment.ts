import "server-only";

import type { Pool } from "pg";

type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
};

type Account = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
} & Record<string, unknown>;

export default async function assignStudentToStaff(
  pool: Pool,
  user: User | Account,
) {
  try {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      // Atomically select next staff (SAFE when no staff exists)
      const {
        rows: [selectedStaff],
      } = await client.query<{
        staff_id: string;
        first_name: string | null;
        last_name: string | null;
        email: string;
      }>(
        `WITH staff_count AS (
              SELECT COUNT(*)::int AS count FROM public.users WHERE role IN ('staff', 'admin')
            ),
            next_index AS (
              UPDATE public.student_staff_assignment_state
              SET last_staff_index =
                CASE
                  WHEN (SELECT count FROM staff_count) > 0
                  THEN (last_staff_index % (SELECT count FROM staff_count)) + 1
                  ELSE last_staff_index
                END
              WHERE id = true AND (SELECT count FROM staff_count) > 0 RETURNING last_staff_index
            ),
            ordered_staff AS (
              SELECT u.id, u.first_name, u.last_name, u.email, ROW_NUMBER() OVER (ORDER BY u.created_at) AS row_num
              FROM public.users u WHERE u.role IN ('staff', 'admin')
            )
            SELECT os.id AS staff_id, os.first_name, os.last_name, os.email
            FROM ordered_staff os JOIN next_index ON os.row_num = next_index.last_staff_index;`,
      );
      // No staff/admin yet → skip assignment safely
      if (!selectedStaff) {
        await client.query("ROLLBACK");
        return;
      }

      // Assign staff
      await client.query(
        `UPDATE public.users SET assigned_staff_id = $1 WHERE id = $2;`,
        [selectedStaff.staff_id, user.id],
      );

      // Notify admins and staff
      await client.query(
        `INSERT INTO public.notifications (recipient_id, title, content)
        SELECT id, 'New Student Alert', $1 FROM public.users
        WHERE role = 'admin' AND id IS DISTINCT FROM $2
        UNION ALL
        SELECT $2, 'New Student Alert', $3;`,
        [
          `${user.name} with email ${user.email} has been assigned to staff ${
            selectedStaff.first_name ?? "Unknown"
          } ${selectedStaff.last_name ?? ""} (${selectedStaff.email}).`,
          selectedStaff.staff_id,
          `${user.name} with email ${user.email} has been assigned to you.`,
        ],
      );
      await client.query("COMMIT");
    } catch {
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  } catch {}
}
