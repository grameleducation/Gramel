"use server";

import { UserRoles } from "@/lib/permissions/role";
import { auth } from "@/utils/better-auth/auth";
import pool from "@/utils/db";
import tryCatch from "@/utils/tryCatch";
import { headers } from "next/headers";
import { SessionUserFields } from "@/lib/types";

interface AssignStudentToStaffParams {
  studentId: string;
  selectedStaffId: string;
}

interface AssignStudentContext {
  studentId: string;
  student_first_name: string | null;
  student_middle_name: string | null;
  student_last_name: string | null;
  student_email: string;
  previous_staff_id: string | null;
  previous_staff_first_name: string | null;
  previous_staff_middle_name: string | null;
  previous_staff_last_name: string | null;
  new_staff_id: string;
  new_staff_first_name: string | null;
  new_staff_middle_name: string | null;
  new_staff_last_name: string | null;
}

interface NotificationPayload {
  recipient_id: string;
  title: string;
  content: string;
}

export async function assignStudentToStaffAction({
  studentId,
  selectedStaffId,
}: AssignStudentToStaffParams): Promise<{ success: boolean; message: string }> {
  if (!studentId || !selectedStaffId) {
    return { success: false, message: "Invalid data provided" };
  }

  // Check user authentication
  const [session, sessionError] = await tryCatch(async () =>
    auth.api.getSession({ headers: await headers() }),
  );
  if (sessionError || !session?.user) {
    return {
      success: false,
      message: "You must be logged in to perform this action",
    };
  }

  const actingUser = session.user as typeof session.user & SessionUserFields;

  if (actingUser.role !== UserRoles.admin) {
    return {
      success: false,
      message: "You are not authorized to perform this action",
    };
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Fetch student, previous staff, new staff, and all admins in one go
    const contextResult = await client.query<AssignStudentContext>(
      `SELECT 
        u.id AS student_id, 
        u.first_name AS student_first_name, 
        u.middle_name AS student_middle_name, 
        u.last_name AS student_last_name, 
        u.email AS student_email,

        ps.id AS previous_staff_id, 
        ps.first_name AS previous_staff_first_name, 
        ps.middle_name AS previous_staff_middle_name, 
        ps.last_name AS previous_staff_last_name,
        
        ns.id AS new_staff_id, 
        ns.first_name AS new_staff_first_name, 
        ns.middle_name AS new_staff_middle_name, 
        ns.last_name AS new_staff_last_name
      FROM 
        public.users u
        LEFT JOIN public.users ps ON u.assigned_staff_id = ps.id 
          AND ps.role = ANY($1::TEXT[])
        LEFT JOIN public.users ns ON ns.id = $2
          AND ns.role = ANY($1::TEXT[])
      WHERE u.id = $3 AND u.role = 'student'`,
      [[UserRoles.admin, UserRoles.staff], selectedStaffId, studentId],
    );

    if (contextResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return { success: false, message: "Student not found." };
    }

    const context = contextResult.rows[0];

    if (!context.new_staff_id) {
      await client.query("ROLLBACK");
      return { success: false, message: "Selected staff does not exist" };
    }

    // Update student's assigned_staff_id
    await client.query(
      `UPDATE public.users SET assigned_staff_id = $1 WHERE id = $2 AND role = 'student'`,
      [selectedStaffId, studentId],
    );

    // Fetch all admins
    const adminsResult = await client.query<{ id: string }>(
      `SELECT id FROM public.users WHERE role = $1`,
      [UserRoles.admin],
    );

    const admins = adminsResult.rows;

    const allNotifications: NotificationPayload[] = [];

    const studentName = `${context.student_first_name || ""} ${
      context.student_middle_name || ""
    } ${context.student_last_name || ""}`.trim();

    const newStaffName = `${context.new_staff_first_name || ""} ${
      context.new_staff_middle_name || ""
    } ${context.new_staff_last_name || ""}`.trim();

    const actingUserName = `${actingUser.first_name || ""} ${
      actingUser.middle_name || ""
    } ${actingUser.last_name || ""}`.trim();

    // Admin notifications
    if (admins.length > 0) {
      const adminNotifications: NotificationPayload[] = admins.map((admin) => ({
        recipient_id: admin.id,
        title: "Student Reassigned to Staff",
        content:
          admin.id === actingUser.id
            ? `You have reassigned ${studentName} (${context.student_email}) to ${
                selectedStaffId === actingUser.id
                  ? "yourself"
                  : newStaffName || "a staff member"
              }.`
            : `The student ${studentName} (${context.student_email}) has been reassigned to ${
                selectedStaffId === admin.id
                  ? "you"
                  : newStaffName || "a staff member"
              } by ${actingUserName}.`,
      }));
      allNotifications.push(...adminNotifications);
    }

    // Previous staff notification (if exists and not the acting user)
    if (
      context.previous_staff_id &&
      context.previous_staff_id !== actingUser.id
    ) {
      allNotifications.push({
        recipient_id: context.previous_staff_id,
        title: "Student Reassigned to Another Staff",
        content: `The student ${studentName} (${context.student_email}) has been reassigned to another staff member by ${actingUserName}.`,
      });
    }

    // New staff notification (if not acting user)
    if (selectedStaffId !== actingUser.id) {
      allNotifications.push({
        recipient_id: selectedStaffId,
        title: "Student Assigned to You",
        content: `The student ${studentName} (${context.student_email}) has been assigned to you by ${actingUserName}.`,
      });
    }

    if (allNotifications.length > 0) {
      const values: string[] = [];
      const placeholders: string[] = [];

      allNotifications.forEach((n, i) => {
        const baseIndex = i * 3;
        placeholders.push(
          `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`,
        );
        values.push(n.recipient_id, n.title, n.content);
      });

      await client.query(
        `INSERT INTO public.notifications (recipient_id, title, content) VALUES ${placeholders.join(",")}`,
        values,
      );
    }

    await client.query("COMMIT");

    return {
      success: true,
      message: "Student assigned to staff successfully!",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to assign student to staff. Please try again.",
    };
  } finally {
    client.release();
  }
}

export async function changeStudentToStaffAction(studentId: string): Promise<{
  success: boolean;
  message: string;
}> {
  if (!studentId) return { success: false, message: "Invalid data provided" };

  // Check user authentication
  const [session, sessionError] = await tryCatch(async () =>
    auth.api.getSession({ headers: await headers() }),
  );
  if (sessionError || !session?.user) {
    return {
      success: false,
      message: "You must be logged in to perform this action",
    };
  }

  const actingUser = session.user as typeof session.user & SessionUserFields;
  if (actingUser.role !== UserRoles.admin) {
    return {
      success: false,
      message: "You are not authorized to perform this action",
    };
  }

  const actingUserName = [
    actingUser.first_name,
    actingUser.middle_name,
    actingUser.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  // Single SQL statement:
  // - updates student -> staff (and acts as existence check via RETURNING)
  // - inserts admin notifications via INSERT...SELECT using CASE for "you"
  // - returns whether an update happened
  const result = await pool.query<{ updated: boolean }>(
    `
    WITH updated AS (
      UPDATE public.users
      SET role = 'staff', assigned_staff_id = NULL
      WHERE id = $1 AND role = 'student'
      RETURNING id, first_name, middle_name, last_name, email
    ),
    inserted AS (
      INSERT INTO public.notifications (recipient_id, title, content)
      SELECT
        admin.id, 'Student Changed to Staff',
        'The student ' ||
          concat_ws(' ', updated.first_name, updated.middle_name, updated.last_name) ||
          ' (' || updated.email || ')' ||
          ' has been changed to staff by ' ||
          CASE WHEN admin.id = $2 THEN 'you' ELSE $3 END || '.'
      FROM public.users admin CROSS JOIN updated
      WHERE admin.role = 'admin'
      RETURNING 1
    )
    SELECT EXISTS(SELECT 1 FROM updated) AS updated
    `,
    [studentId, actingUser.id, actingUserName],
  );

  const updated = result.rows[0]?.updated ?? false;
  if (!updated) {
    return { success: false, message: "Student not found." };
  }

  return { success: true, message: "Student changed to staff successfully!" };
}
