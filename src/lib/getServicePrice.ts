import "server-only";

import pool from "@/utils/db";

export async function getServicePriceKobo(
  serviceSlug: string,
  optionName?: string | null,
): Promise<number | null> {
  const optionValue = optionName ?? null;

  const res = await pool.query<{ price_kobo: number }>(
    `SELECT price_kobo
     FROM public.service_prices
     WHERE service_slug = $1 AND (($2::TEXT IS NULL AND option_name IS NULL) OR option_name = $2)
     LIMIT 1`,
    [serviceSlug, optionValue],
  );

  return res.rows[0]?.price_kobo ?? null;
}
