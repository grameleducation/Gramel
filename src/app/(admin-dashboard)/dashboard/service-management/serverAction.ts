"use server";

import { z } from "zod";
import { auth } from "@/utils/better-auth/auth";
import { headers } from "next/headers";
import tryCatch from "@/utils/tryCatch";
import pool from "@/utils/db";
import { UserActions } from "@/lib/permissions/role";
import { hasPermission } from "@/lib/permissions/utils";
import { isUserRole } from "@/utils/isUserRoles";
import { revalidatePath } from "next/cache";

export async function updateServicePriceAction(params: {
  serviceSlug: string;
  optionName: string | null;
  newPriceNaira: number;
}): Promise<{ success: true } | { success: false; error: string }> {
  const [session, sessionError] = await tryCatch(async () =>
    auth.api.getSession({ headers: await headers() }),
  );

  if (sessionError || !session?.user) {
    return { success: false, error: "You must be logged in." };
  }

  if (
    !isUserRole(session.user.role) ||
    !hasPermission(session.user.role, UserActions.update_services_price)
  ) {
    return {
      success: false,
      error: "You are not authorized to update prices.",
    };
  }

  const schema = z.object({
    serviceSlug: z.string().trim().min(1),
    optionName: z.string().trim().nullable(),
    newPriceNaira: z
      .number()
      .nonnegative()
      .refine((v) => {
        const parts = v.toString().split(".");
        const dec = parts[1];
        return !dec || dec.length <= 2;
      }, "Price can have up to 2 decimal places"),
  });

  const parsed = schema.safeParse(params);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid data.",
    };
  }

  const { serviceSlug, optionName, newPriceNaira } = parsed.data;
  const newPriceKobo = Math.round(newPriceNaira * 100);

  try {
    // Use a single query with CTEs to check existence, update price, and insert history in one transaction
    const result = await pool.query<{
      price_row_exists: boolean;
      price_was_updated: boolean;
    }>(
      `WITH target AS (
         SELECT id, service_slug, option_name, service_code, price_kobo
         FROM public.service_prices
         WHERE service_slug = $1
           AND (
             ($2::TEXT IS NULL AND option_name IS NULL)
             OR option_name = $2
           )
         LIMIT 1
         FOR UPDATE
       ),
       updated AS (
         UPDATE public.service_prices AS sp
         SET price_kobo = $3
         FROM target
         WHERE sp.id = target.id
           AND target.price_kobo <> $3
         RETURNING
           target.service_slug,
           target.option_name,
           target.service_code,
           target.price_kobo AS old_price_kobo
       ),
       history AS (
         INSERT INTO public.service_price_history
           (service_slug, option_name, service_code, old_price_kobo, new_price_kobo, changed_by)
         SELECT
           service_slug,
           option_name,
           service_code,
           old_price_kobo,
           $3,
           $4
         FROM updated
       )
       SELECT
         EXISTS (SELECT 1 FROM target) AS price_row_exists,
         EXISTS (SELECT 1 FROM updated) AS price_was_updated`,
      [serviceSlug, optionName, newPriceKobo, session.user.id],
    );

    const outcome = result.rows[0];

    if (!outcome?.price_row_exists) {
      return {
        success: false,
        error: "Service price was not found.",
      };
    }

    if (!outcome.price_was_updated) {
      return {
        success: false,
        error: "Current price is the same as the new price.",
      };
    }

    revalidatePath(`/services/${serviceSlug}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update service price.",
    };
  }
}
