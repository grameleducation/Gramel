"use server";

import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { UserActions, UserRoles } from "@/lib/permissions/role";
import { auth } from "@/utils/better-auth/auth";
import { headers } from "next/headers";
import tryCatch from "@/utils/tryCatch";
import pool from "@/utils/db";
import { servicesDetails } from "@/app/(general-view)/services/[slug]/servicesData";
import { isUserRole } from "@/utils/isUserRoles";
import { hasPermission } from "@/lib/permissions/utils";
import { normalize } from "@/utils/normalize";
import moment from "moment";
import { after } from "next/server";
import transporter from "@/utils/emailTransporter";
import { offlinePaymentEntryCreated } from "@/lib/emailTemplates";
import server_env from "@/utils/env.server";

type CreateOfflinePaymentResponse =
  | { success: true }
  | { success: false; error: string };

interface BasicUser {
  id: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
}

interface NotificationPayload {
  recipient_id: string;
  title: string;
  content: string;
}

export async function createOfflinePaymentEntry(params: {
  studentId: string;
  serviceSlug: string;
  selectedOptionName?: string;
  amountInNaira: number;
  paidAt: string;
  proofOfPaymentUrl?: string | null;
}): Promise<CreateOfflinePaymentResponse> {
  try {
    const schema = z.object({
      studentId: z.string().trim().min(1),
      serviceSlug: z.string().trim().min(1),
      selectedOptionName: z.string().trim().min(1).optional(),
      amountInNaira: z
        .number()
        .positive()
        .refine((amount) => {
          const decimalPart = amount.toString().split(".")[1];
          return !decimalPart || decimalPart.length <= 2;
        }, "Amount cannot have more than 2 decimal places"),
      paidAt: z
        .string()
        .trim()
        .refine(
          (date) => moment(date, "YYYY-MM-DD", true).isValid(),
          "Please provide a valid date in YYYY-MM-DD format",
        )
        .refine(
          (date) => moment(date).isBefore(moment(), "day"),
          "Payment date cannot be in the future",
        )
        .transform((date) => moment.utc(date).toDate()),
      proofOfPaymentUrl: z.string().url().nullish(),
    });

    const parsed = schema.safeParse(params);
    if (!parsed.success) {
      return { success: false, error: "Invalid data provided." };
    }

    const {
      studentId,
      serviceSlug,
      selectedOptionName,
      amountInNaira,
      paidAt,
      proofOfPaymentUrl,
    } = parsed.data;

    // Check user authentication
    const [session, sessionError] = await tryCatch(async () =>
      auth.api.getSession({ headers: await headers() }),
    );
    if (sessionError || !session?.user) {
      return { success: false, error: "You must be logged in." };
    }

    const actingUser = session.user;

    // Check user permission
    if (
      !isUserRole(actingUser.role) ||
      !hasPermission(actingUser.role, UserActions.view_student_profile_as_admin)
    ) {
      return {
        success: false,
        error: "You are not authorized to create payments.",
      };
    }

    // Verify student exists and get basic info (top-level check)
    const [studentResult, studentError] = await tryCatch(() =>
      pool.query<{
        id: string;
        first_name: string | null;
        middle_name: string | null;
        last_name: string | null;
        email: string;
      }>(
        `SELECT id, first_name, middle_name, last_name, email FROM public.users
         WHERE id = $1 AND role = 'student'`,
        [studentId],
      ),
    );

    if (studentError) {
      return {
        success: false,
        error: "An error occurred while verifying the student.",
      };
    }

    const student = studentResult.rows[0];
    if (!student) {
      return { success: false, error: "Student not found." };
    }

    const service = servicesDetails[serviceSlug];
    if (!service) {
      return { success: false, error: "Invalid service selected." };
    }

    // Convert amount to kobo
    const amountInKobo = Math.round(amountInNaira * 100);

    let serviceName = service.title;
    let serviceCode = service.serviceCode;

    // Handle services with options (tests or application packages)
    if (serviceSlug === "language-proficiency-tests" && service.tests) {
      if (!selectedOptionName) {
        return { success: false, error: "Please select a test." };
      }
      const selectedTest = service.tests.find(
        (t) => normalize(t.name) === normalize(selectedOptionName),
      );

      if (!selectedTest) {
        return { success: false, error: "Selected test not found." };
      }
      serviceName = `${selectedTest.name} - ${service.title}`;
      serviceCode = selectedTest.serviceCode;
    } else if (
      serviceSlug === "international-admissions" &&
      service.applicationOptions
    ) {
      if (!selectedOptionName) {
        return {
          success: false,
          error: "Please select an application package.",
        };
      }
      const selectedOption = service.applicationOptions.find(
        (o) => normalize(o.name) === normalize(selectedOptionName),
      );
      if (!selectedOption) {
        return {
          success: false,
          error: "Selected application package not found.",
        };
      }
      serviceName = `${selectedOption.name} - ${service.title}`;
      serviceCode = selectedOption.serviceCode;
    }

    const transactionReference = `${serviceCode}-${uuidv4().replace(/-/g, "")}`;

    const [, insertError] = await tryCatch(() =>
      pool.query(
        `INSERT INTO public.payment_transactions (
          user_id,
          transaction_reference,
          service,
          service_slug,
          service_code,
          amount,
          status,
          payment_type,
          created_by,
          proof_of_payment,
          paid_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'completed', 'offline', $7, $8, $9)`,
        [
          studentId,
          transactionReference,
          serviceName,
          serviceSlug,
          serviceCode,
          amountInKobo,
          actingUser.id,
          proofOfPaymentUrl ?? null,
          paidAt,
        ],
      ),
    );

    if (insertError) {
      return {
        success: false,
        error: "Failed to create offline payment. Please try again.",
      };
    }

    // Schedule notifications and email sending after the response
    after(async () => {
      try {
        // Get all admins for notifications and emails
        const [adminsResult, adminsError] = await tryCatch(() =>
          pool.query<BasicUser>(
            `SELECT id, first_name, middle_name, last_name, email, role FROM public.users WHERE role = $1`,
            [UserRoles.admin],
          ),
        );

        if (!adminsError) {
          const admins = adminsResult.rows;

          const studentName = [
            student.first_name,
            student.middle_name,
            student.last_name,
          ]
            .filter(Boolean)
            .join(" ");

          const actingUserName = [
            actingUser.first_name,
            actingUser.middle_name,
            actingUser.last_name,
          ]
            .filter(Boolean)
            .join(" ");

          const formattedAmount = amountInNaira.toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          const formattedDate = moment(paidAt).format("DD-MM-YYYY");

          const allNotifications: NotificationPayload[] = [];

          // Admin notifications
          if (admins.length > 0) {
            const adminNotifications: NotificationPayload[] = admins.map(
              (admin) => ({
                recipient_id: admin.id,
                title: "Offline Payment Recorded for Student",
                content:
                  admin.id === actingUser.id
                    ? `You have recorded an offline payment for ${studentName || "a student"} (${student.email}) for the service "${serviceName}". Amount: ₦${formattedAmount}. Paid on: ${formattedDate}.`
                    : `An offline payment has been recorded for ${studentName || "a student"} (${student.email}) for the service "${serviceName}". Amount: ₦${formattedAmount}. Paid on: ${formattedDate}. Recorded by ${actingUserName || "an admin/staff"}.`,
              }),
            );
            allNotifications.push(...adminNotifications);
          }

          // Staff notification (if action performed by staff)
          if (actingUser.role === UserRoles.staff) {
            allNotifications.push({
              recipient_id: actingUser.id,
              title: "Offline Payment Entry Created",
              content: `You have created an offline payment entry for ${studentName || "a student"} (${student.email}) for the service "${serviceName}". Amount: ₦${formattedAmount}. Paid on: ${formattedDate}.`,
            });
          }

          // Insert notifications
          if (allNotifications.length > 0) {
            // Create prepared statements for the notifications
            const values: string[] = [];
            const placeholders: string[] = [];

            allNotifications.forEach((n, i) => {
              const baseIndex = i * 3;
              placeholders.push(
                `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`,
              );
              values.push(n.recipient_id, n.title, n.content);
            });

            await pool.query(
              `INSERT INTO public.notifications (recipient_id, title, content) VALUES ${placeholders.join(",")}`,
              values,
            );
          }

          // Send emails to admins in parallel
          if (admins.length > 0) {
            const emailParams = {
              studentName: studentName || "N/A",
              studentEmail: student.email,
              serviceName,
              amount: formattedAmount,
              paidAt: formattedDate,
              actorName: actingUserName || "N/A",
            };

            await Promise.all(
              admins.map((admin) =>
                transporter.sendMail({
                  from: server_env.SMTP_USER,
                  to: admin.email,
                  subject: offlinePaymentEntryCreated.subject,
                  text: offlinePaymentEntryCreated.text(emailParams),
                  html: offlinePaymentEntryCreated.html(emailParams),
                }),
              ),
            );
          }
        }
      } catch {}
    });

    return { success: true };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
