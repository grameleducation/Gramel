import { redirect } from "next/navigation";
import { UserActions } from "@/lib/permissions/role";
import { hasPermission } from "@/lib/permissions/utils";
import { auth } from "@/utils/better-auth/auth";
import tryCatch from "@/utils/tryCatch";
import { headers } from "next/headers";
import { isUserRole } from "@/utils/isUserRoles";
import ServiceManagementView from "./ServiceManagementView";
import type { ManagedService, PriceHistoryEntry } from "./types";
import pool from "@/utils/db";
import { servicesDetails } from "@/app/(general-view)/services/[slug]/servicesData";
import { normalize } from "@/utils/normalize";

function optionKey(serviceSlug: string, optionName: string | null) {
  return normalize(`${serviceSlug}::${optionName || "BASE"}`);
}

export async function getServiceManagementDataAction(): Promise<
  ManagedService[]
> {
  const [pricesRes, historyRes] = await Promise.all([
    pool.query<{
      service_slug: string;
      option_name: string | null;
      service_code: string;
      price_kobo: number;
    }>(
      `SELECT service_slug, option_name, service_code, price_kobo FROM public.service_prices`,
    ),
    pool.query<{
      service_slug: string;
      option_name: string | null;
      service_code: string;
      old_price_kobo: number;
      new_price_kobo: number;
      changed_at: string;
      changed_by: string | null;
      first_name: string | null;
      middle_name: string | null;
      last_name: string | null;
      email: string | null;
    }>(
      `SELECT
         h.service_slug,
         h.option_name,
         h.service_code,
         h.old_price_kobo,
         h.new_price_kobo,
         h.changed_at,
         u.id AS changed_by,
         u.first_name,
         u.middle_name,
         u.last_name,
         u.email
       FROM public.service_price_history h
       LEFT JOIN public.users u ON u.id = h.changed_by
       ORDER BY h.changed_at DESC`,
    ),
  ]);

  const currentPricesMap = new Map<
    string,
    { serviceCode: string; price: number }
  >();
  for (const row of pricesRes.rows) {
    currentPricesMap.set(optionKey(row.service_slug, row.option_name), {
      serviceCode: row.service_code,
      price: row.price_kobo,
    });
  }

  const priceHistoryMap = new Map<string, PriceHistoryEntry[]>();
  for (const h of historyRes.rows) {
    const key = optionKey(h.service_slug, h.option_name);
    const entry: PriceHistoryEntry = {
      changedAt: h.changed_at,
      actorName:
        [h.first_name, h.middle_name, h.last_name].filter(Boolean).join(" ") ||
        "-",
      actorId: h.changed_by || "-",
      actorEmail: h.email,
      oldPriceKobo: h.old_price_kobo,
      newPriceKobo: h.new_price_kobo,
    };

    const list = priceHistoryMap.get(key);
    if (list) list.push(entry);
    else priceHistoryMap.set(key, [entry]);
  }

  const services: ManagedService[] = Object.entries(servicesDetails).map(
    ([serviceSlug, meta]) => {
      const baseKey = optionKey(serviceSlug, null);
      const base = currentPricesMap.get(baseKey);
      if (!base) throw new Error(`Price not found for service ${serviceSlug}`);

      return {
        ...meta,
        serviceSlug,
        serviceCode: base.serviceCode,
        price: base.price,
        history: priceHistoryMap.get(baseKey) ?? [],
        tests: meta.tests?.map((test) => {
          const key = optionKey(serviceSlug, test.name);
          const row = currentPricesMap.get(key);
          if (!row) {
            throw new Error(
              `Test price not found for service ${serviceSlug} and test ${test.name}`,
            );
          }
          return {
            ...test,
            serviceCode: row.serviceCode,
            price: row.price,
            history: priceHistoryMap.get(key) ?? [],
          };
        }),
        applicationOptions: meta.applicationOptions?.map((option) => {
          const key = optionKey(serviceSlug, option.name);
          const row = currentPricesMap.get(key);
          if (!row) {
            throw new Error(
              `Application option price not found for service ${serviceSlug} and option ${option.name}`,
            );
          }
          return {
            ...option,
            serviceCode: row.serviceCode,
            price: row.price,
            history: priceHistoryMap.get(key) ?? [],
          };
        }),
      };
    },
  );

  return services;
}

export default async function ServiceManagementPage() {
  const [result, error] = await tryCatch(async () =>
    auth.api.getSession({ headers: await headers() }),
  );

  if (error) redirect("/");
  if (!result?.user) redirect("/login");

  if (
    !isUserRole(result.user.role) ||
    !hasPermission(result.user.role, UserActions.view_admin_dashboard)
  ) {
    redirect("/");
  }

  const [data, serviceManagementError] = await tryCatch(
    getServiceManagementDataAction,
  );

  if (serviceManagementError) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-light-gray pt-6 pb-8 sm:pt-12">
      <ServiceManagementView services={data} />
    </main>
  );
}
