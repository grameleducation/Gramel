"use server";

import { UserRoles } from "@/lib/permissions/role";
import { auth } from "@/utils/better-auth/auth";
import pool from "@/utils/db";
import tryCatch from "@/utils/tryCatch";
import { headers } from "next/headers";
import { SessionUserFields } from "@/lib/types";

interface BasicUser {
  id: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  role: UserRoles;
}

type RevertAction = "redistribute" | "assign" | "unassign" | null;

interface RevertStaffToStudentParams {
  staffId: string;
  action: RevertAction;
  selectedStaffId?: string;
}

interface staffInfo {
  id: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  email: string;
}

interface StudentInfo {
  student_id: string;
  student_first_name: string | null;
  student_middle_name: string | null;
  student_last_name: string | null;
  student_email: string;
}

interface NotificationPayload {
  recipient_id: string;
  title: string;
  content: string;
}

export async function revertStaffToStudentAction({
  staffId,
  action,
  selectedStaffId,
}: RevertStaffToStudentParams): Promise<{ success: boolean; message: string }> {
  if (!staffId) return { success: false, message: "No staff provided" };

  const client = await pool.connect();
  try {
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
        message: "You must be an admin to perform this action",
      };
    }

    // Start transaction
    await client.query(`BEGIN`);

    // Fetch staff and assigned students
    const staffWithStudentsResult = await client.query<staffInfo & StudentInfo>(
      ` SELECT u.id, u.first_name, u.middle_name, u.last_name, u.email, u.role,
       s.id AS student_id, s.first_name AS student_first_name, s.middle_name AS student_middle_name, s.last_name AS student_last_name, s.email AS student_email
       FROM public.users u
       LEFT JOIN public.users s ON s.assigned_staff_id = u.id AND s.role = 'student'
       WHERE u.id = $1`,
      [staffId],
    );

    // Check if staff exists
    if (staffWithStudentsResult.rows.length === 0) {
      return { success: false, message: "Staff member not found" };
    }

    let otherStaff: BasicUser[] | null = null;
    let studentBatches: {
      staffId: string;
      staffInfo: BasicUser;
      students: StudentInfo[];
    }[] = [];

    // Handle redistribution / assignment / unassignment of students
    const hasStudents = staffWithStudentsResult.rows.some(
      (row) => row.student_id,
    );
    if (hasStudents) {
      if (action === "redistribute") {
        const otherStaffResult = await client.query<BasicUser>(
          `SELECT id, first_name, middle_name, last_name, role FROM public.users
           WHERE role IN ($1, $2) AND id <> $3`,
          [UserRoles.admin, UserRoles.staff, staffId],
        );

        otherStaff = otherStaffResult.rows;

        if (!otherStaff || otherStaff.length === 0) {
          return {
            success: false,
            message: "No available staff members found for redistribution",
          };
        }

        const staffCount = otherStaff.length;

        // Group students for each staff member
        studentBatches = otherStaff.map((s) => ({
          staffId: s.id,
          staffInfo: s,
          students: [],
        }));

        staffWithStudentsResult.rows.forEach((row, index) => {
          const staffIndex = index % staffCount;
          studentBatches[staffIndex].students.push({
            student_id: row.student_id!,
            student_first_name: row.student_first_name,
            student_middle_name: row.student_middle_name,
            student_last_name: row.student_last_name,
            student_email: row.student_email!,
          });
        });

        // Create SQL CASE statements for each group
        const updateCases: string[] = [];
        const params: (string | string[])[] = [staffId];

        for (const batch of studentBatches) {
          if (batch.students.length > 0) {
            const studentIds = batch.students.map((s) => s.student_id);
            params.push(batch.staffId, studentIds);
            updateCases.push(
              `WHEN id = ANY($${params.length}::TEXT[]) THEN $${params.length - 1}`,
            );
          }
        }

        if (updateCases.length > 0) {
          // Redistribute students among available staff
          await client.query(
            `UPDATE public.users
             SET assigned_staff_id = CASE ${updateCases.join(" ")} ELSE assigned_staff_id END
             WHERE assigned_staff_id = $1 AND role = 'student';`,
            params,
          );
        }
      } else if (action === "assign" && selectedStaffId) {
        // Check if selectedStaffId exists
        const staffExists = await client.query(
          `SELECT EXISTS(SELECT 1 FROM public.users WHERE id = $1 AND role = 'staff')`,
          [selectedStaffId],
        );

        if (!staffExists.rows[0].exists) {
          return {
            success: false,
            message: "Selected staff member does not exist",
          };
        }

        // Assign students to the selected staff
        await client.query(
          `UPDATE public.users SET assigned_staff_id = $1 WHERE assigned_staff_id = $2 AND role = 'student';`,
          [selectedStaffId, staffId],
        );
      } else if (action === "unassign") {
        // Unassign students from the staff
        await client.query(
          `UPDATE public.users SET assigned_staff_id = NULL WHERE assigned_staff_id = $1 AND role = 'student';`,
          [staffId],
        );
      }
    }

    // Update the staff member to a student
    await client.query(
      `UPDATE public.users SET role = 'student', assigned_staff_id = $1 WHERE id = $2`,
      [actingUser.id, staffId],
    );

    // Get admin users to notify them about the action
    let admins: BasicUser[] | null = null;
    if (action === "redistribute" && otherStaff) {
      admins = otherStaff.filter((st) => st.role === UserRoles.admin);
    } else {
      const adminsResult = await client.query<BasicUser>(
        `SELECT id, first_name, middle_name, last_name, role FROM public.users WHERE role = $1`,
        [UserRoles.admin],
      );
      admins = adminsResult.rows;
    }

    // Collect all notifications (admin + staff)
    const allNotifications: NotificationPayload[] = [];

    const staff = staffWithStudentsResult.rows[0];
    const staffName = `${staff.first_name || ""} ${staff.middle_name || ""} ${
      staff.last_name || ""
    }`.trim();

    const actingUserName = `${actingUser.first_name || ""} ${
      actingUser.middle_name || ""
    } ${actingUser.last_name || ""}`.trim();

    // Create admin notifications
    if (admins && admins.length > 0) {
      const adminNotifications: NotificationPayload[] = admins.map((admin) => ({
        recipient_id: admin.id,
        title: "Staff Reverted to Student",
        content:
          admin.id === actingUser.id
            ? `You have reverted ${staffName} (${staff.email}) to a student role.`
            : `The staff member ${staffName} (${staff.email}) has been reverted to a student by ${actingUserName}.`,
      }));
      allNotifications.push(...adminNotifications);
    }

    // Helper function to format student list for notifications
    const formatStudentList = (staffWithStudents: StudentInfo[]) => {
      return staffWithStudents
        .map(
          (s) =>
            `<li>${s.student_first_name || ""} ${s.student_middle_name || ""} ${
              s.student_last_name || ""
            } (${s.student_email})</li>`,
        )
        .join("");
    };

    // Create staff notifications based on action
    if (action === "redistribute" && otherStaff && studentBatches.length > 0) {
      // Notify each staff member about their newly assigned students
      const staffNotifications: NotificationPayload[] = studentBatches
        .filter((batch) => batch.students.length > 0)
        .map((batch) => ({
          recipient_id: batch.staffId,
          title: "Students Reassigned to You",
          content: `${batch.students.length} student${
            batch.students.length > 1 ? "s have" : " has"
          } been reassigned to you during a redistribution of student${
            batch.students.length > 1 ? "s" : ""
          } by ${
            batch.staffId === actingUser.id ? "yourself" : actingUserName
          }. The reassigned student${
            batch.students.length > 1
              ? `s are:<ul>${formatStudentList(batch.students)}</ul>`
              : ` is ${batch.students[0].student_first_name || ""} ${
                  batch.students[0].student_middle_name || ""
                } ${batch.students[0].student_last_name || ""} (${
                  batch.students[0].student_email
                }).`
          }`,
        }));
      allNotifications.push(...staffNotifications);
    } else if (action === "assign" && selectedStaffId && hasStudents) {
      const numberOfStudents = staffWithStudentsResult.rows.length;

      // Notify the selected staff member about the assigned students
      allNotifications.push({
        recipient_id: selectedStaffId,
        title:
          selectedStaffId === actingUser.id
            ? "Students Reassigned to Yourself"
            : "Students Reassigned to You",
        content: `${numberOfStudents} student${
          numberOfStudents > 1 ? "s have" : " has"
        } been reassigned to you by ${
          selectedStaffId === actingUser.id
            ? "yourself during a staff change to student"
            : actingUserName
        }. The reassigned student${
          numberOfStudents > 1
            ? `s are:<ul>${formatStudentList(staffWithStudentsResult.rows)}</ul>`
            : ` is ${staffWithStudentsResult.rows[0].student_first_name || ""} ${
                staffWithStudentsResult.rows[0].student_middle_name || ""
              } ${staffWithStudentsResult.rows[0].student_last_name || ""} (${
                staffWithStudentsResult.rows[0].student_email
              }).`
        }`,
      });
    }

    // Insert all notifications at once
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
      `INSERT INTO public.notifications (recipient_id, title, content) VALUES ${placeholders.join(",")};`,
      values,
    );

    // Delete all notifications for the staff reverted to student
    await client.query(
      `DELETE FROM public.notifications WHERE recipient_id = $1;`,
      [staffId],
    );

    await client.query(`COMMIT`);
    return {
      success: true,
      message: "Staff reverted to student successfully",
    };
  } catch (error) {
    await client.query(`ROLLBACK`);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to revert staff to student. Please try again.",
    };
  } finally {
    client.release();
  }
}
