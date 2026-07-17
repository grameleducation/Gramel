"use server";

import { v4 as uuidv4 } from "uuid";
import { servicesDetails } from "./servicesData";
import server_env from "@/utils/env.server";
import { z } from "zod";
import { UserRoles } from "@/lib/permissions/role";
import tryCatch from "@/utils/tryCatch";
import { auth } from "@/utils/better-auth/auth";
import { headers } from "next/headers";
import pool from "@/utils/db";
import { Database } from "@/utils/supabase/types";
import { normalize } from "@/utils/normalize";
import { getServicePriceKobo } from "@/lib/getServicePrice";
import { SessionUserFields } from "@/lib/types";

// Create testNameSchema for language-proficiency-tests
const languageTestNames = (
  servicesDetails["language-proficiency-tests"].tests || []
).map((t) => t.name) as [string, ...string[]];
const testNameSchema = z.enum(languageTestNames);

// Create applicationOptionSchema for international-admissions
const applicationOptionNames = (
  servicesDetails["international-admissions"].applicationOptions || []
).map((o) => o.name) as [string, ...string[]];
const applicationOptionSchema = z.enum(applicationOptionNames);

// =================== INITIALIZE PAYSTACK TRANSACTION ===============
interface PaymentInitResponse {
  success: boolean;
  accessCode?: string;
  error?: string;
}

export async function initializePayment(
  serviceSlug: string,
  selectedOptionName?: string,
): Promise<PaymentInitResponse> {
  try {
    // Validate service exists
    const service = servicesDetails[serviceSlug];
    if (!service) {
      return {
        success: false,
        error: "Invalid service selected",
      };
    }

    // Check user authentication
    const [session, sessionError] = await tryCatch(async () =>
      auth.api.getSession({
        headers: await headers(),
        query: { disableCookieCache: true },
      }),
    );
    if (sessionError || !session?.user) {
      return {
        success: false,
        error: "Authentication required. Please log in to continue.",
      };
    }
    const user = session.user as typeof session.user & SessionUserFields;

    if (!user.email) {
      return {
        success: false,
        error: "User email not found. Please contact support.",
      };
    }

    if (user.role !== UserRoles.student) {
      return {
        success: false,
        error: "Unauthorized access. Only students can initiate this payment.",
      };
    }

    // Determine transaction reference and amount
    let transactionReference: string;
    let amount: number;
    let serviceName: string;
    let serviceCode: string;

    if (serviceSlug === "language-proficiency-tests" && service.tests) {
      const parsedTestName = testNameSchema.safeParse(selectedOptionName);
      if (!parsedTestName.success) {
        return { success: false, error: "Invalid test selected." };
      }
      const selectedTest = service.tests.find(
        (t) => normalize(t.name) === normalize(parsedTestName.data),
      );
      if (!selectedTest) {
        return { success: false, error: "Test not found." };
      }
      const price = await getServicePriceKobo(serviceSlug, selectedTest.name);
      if (!price) return { success: false, error: "Test price not found." };

      transactionReference = `${selectedTest.serviceCode}-${uuidv4().replace(/-/g, "")}`;
      amount = price;
      serviceName = `${selectedTest.name} - ${service.title}`;
      serviceCode = selectedTest.serviceCode;
    } else if (
      serviceSlug === "international-admissions" &&
      service.applicationOptions
    ) {
      const parsedApplicationOption =
        applicationOptionSchema.safeParse(selectedOptionName);
      if (!parsedApplicationOption.success) {
        return {
          success: false,
          error: "Invalid application option selected.",
        };
      }
      const selectedOption = service.applicationOptions.find(
        (o) => normalize(o.name) === normalize(parsedApplicationOption.data),
      );
      if (!selectedOption) {
        return { success: false, error: "Application option not found." };
      }
      const price = await getServicePriceKobo(serviceSlug, selectedOption.name);
      if (!price)
        return { success: false, error: "Application option price not found." };

      transactionReference = `${service.serviceCode}-${uuidv4()}`;
      amount = price;
      serviceName = `${selectedOption.name} - ${service.title}`;
      serviceCode = selectedOption.serviceCode;
    } else {
      const price = await getServicePriceKobo(serviceSlug, null);
      if (!price) return { success: false, error: "Service price not found." };

      transactionReference = `${service.serviceCode}-${uuidv4().replace(/-/g, "")}`;
      amount = price;
      serviceName = service.title;
      serviceCode = service.serviceCode;
    }

    // Prepare Paystack transaction data
    const transactionData = {
      amount, // Amount in kobo (smallest currency unit)
      email: user.email,
      currency: "NGN",
      reference: transactionReference,
      metadata: {
        custom_fields: [
          {
            display_name: "First Name",
            variable_name: "first_name",
            value: user.first_name || "",
          },
          {
            display_name: "Middle Name",
            variable_name: "middle_name",
            value: user.middle_name || "",
          },
          {
            display_name: "Last Name",
            variable_name: "last_name",
            value: user.last_name || "",
          },
          {
            display_name: "Service",
            variable_name: "service",
            value: serviceName,
          },
          {
            display_name: "Service Title",
            variable_name: "service_title",
            value: service.title,
          },
          {
            display_name: "User Email",
            variable_name: "user_email",
            value: user.email,
          },
          {
            display_name: "User ID",
            variable_name: "user_id",
            value: user.id,
          },
        ],
      },
    };

    // Initialize Paystack transaction
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${server_env.PAYSTACK_SECRET_KEY!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      },
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Payment initialization failed. Please try again.",
      };
    }

    const result = await response.json();

    if (result.status && result.data?.access_code) {
      // Store transaction reference for verification using supabase admin client. Ordinary users cannot create payment entries
      const [, insertError] = await tryCatch(() =>
        pool.query(
          `INSERT INTO public.payment_transactions (user_id, transaction_reference, amount, status, service, service_slug, access_code, service_code, payment_type)
         VALUES ($1, $2, $3, 'pending', $4, $5, $6, $7, 'online')`,
          [
            user.id,
            transactionReference,
            amount,
            serviceName,
            serviceSlug,
            result.data.access_code,
            serviceCode,
          ],
        ),
      );

      if (insertError) {
        return {
          success: false,
          error:
            "An error occured initializing your payment. Please try again later.",
        };
      }

      return {
        success: true,
        accessCode: result.data.access_code,
      };
    } else {
      return {
        success: false,
        error: "Payment initialization failed. Please try again.",
      };
    }
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// ===================== VERIFY SUCCESSFUL TRANSACTION ======================
interface PaymentVerificationResponse {
  success: boolean;
  error?: string;
  serviceSlug?: string;
}

export async function verifyTransaction(
  reference: string,
): Promise<PaymentVerificationResponse> {
  try {
    // validate transaction reference
    z.string().trim().min(1).parse(reference);

    // Verify transaction with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${server_env.PAYSTACK_SECRET_KEY!}`,
        },
      },
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Transaction verification failed.",
      };
    }

    const result = await response.json();

    if (!result.status) {
      return {
        success: false,
        error: "Transaction verification failed.",
      };
    }

    const transaction = result.data;

    // Verify transaction details
    if (
      transaction.status !== "success" ||
      transaction.reference !== reference
    ) {
      return {
        success: false,
        error: "Transaction verification failed.",
      };
    }

    // Get transaction from database
    const [dbTransactionResult, dbError] = await tryCatch(() =>
      pool.query<Database["public"]["Tables"]["payment_transactions"]["Row"]>(
        `SELECT * FROM public.payment_transactions WHERE transaction_reference = $1`,
        [reference],
      ),
    );

    if (dbError) {
      return {
        success: false,
        error:
          "An error occurred getting your transaction. Please contact support.",
      };
    }

    const dbTransaction = dbTransactionResult.rows[0];
    if (!dbTransaction) {
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    // Verify amount paid matches expected amount
    if (transaction.amount !== dbTransaction.amount) {
      return {
        success: false,
        error: "Amount paid is not the expected amount",
      };
    }

    // Update transaction status

    const [, updateError] = await tryCatch(() =>
      pool.query(
        `UPDATE public.payment_transactions SET status = 'completed', paid_at = $1 WHERE transaction_reference = $2`,
        [new Date().toISOString(), reference],
      ),
    );

    if (updateError) {
      return {
        success: false,
        error: "Transaction update failed.",
      };
    }

    // Get service details
    // const service = servicesDetails[dbTransaction.service_slug];
    // if (service) {
    // Get user details

    // if (user) {
    // Send confirmation emails (placeholder for now)
    // TODO: Implement email sending logic
    // console.log("Payment successful:", {
    //   user: user.email,
    //   service: service.title,
    //   amount: transaction.amount,
    //   reference,
    // });
    // }
    // } else {
    //   console.error("Service not found:", dbTransaction.service_slug);
    // }

    return {
      success: true,
      serviceSlug: dbTransaction.service_slug,
    };
  } catch {
    return {
      success: false,
      error: "Unexpected error occurred verifying your transaction.",
    };
  }
}
