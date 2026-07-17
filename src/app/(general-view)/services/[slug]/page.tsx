import { notFound } from "next/navigation";
import Image from "next/image";
import PaymentSection from "./PaymentSection";
import { servicesDetails } from "./servicesData";
import pool from "@/utils/db";
import tryCatch from "@/utils/tryCatch";
import type { ServiceDetail } from "./types";

export const revalidate = 3600; // revalidate once in one hour

export async function generateStaticParams() {
  return Object.keys(servicesDetails).map((slug) => ({ slug }));
}

async function getServiceDetailsWithCurrentPrices(
  serviceSlug: string,
): Promise<ServiceDetail | null> {
  const service = servicesDetails[serviceSlug];
  if (!service) return null;

  // Falls back to null (→ notFound()) instead of throwing when the database
  // is unreachable, so environments without DATABASE_URL (e.g. the assist
  // subdomain's build, which never serves this route) don't fail the build.
  const [pricesRes, queryError] = await tryCatch(() =>
    pool.query<{
      option_name: string | null;
      price_kobo: number;
    }>(
      `SELECT option_name, price_kobo
     FROM public.service_prices
     WHERE service_slug = $1`,
      [serviceSlug],
    ),
  );
  if (queryError) return null;

  const pricesByOption = new Map<string | null, number>();
  for (const row of pricesRes.rows) {
    pricesByOption.set(row.option_name, row.price_kobo);
  }

  // Base price
  const basePrice = pricesByOption.get(null);
  if (typeof basePrice === "number") service.price = basePrice;
  else return null;

  if (service.tests?.length) {
    let hasPrice = false;
    service.tests = service.tests.map((t) => {
      const price = pricesByOption.get(t.name);
      if (typeof price === "number") {
        hasPrice = true;
        return { ...t, price };
      }
      return t;
    });
    if (!hasPrice) return null;
  }

  if (service.applicationOptions?.length) {
    let hasPrice = false;
    service.applicationOptions = service.applicationOptions.map((o) => {
      const price = pricesByOption.get(o.name);
      if (typeof price === "number") {
        hasPrice = true;
        return { ...o, price };
      }
      return o;
    });
    if (!hasPrice) return null;
  }

  return service;
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceDetailsWithCurrentPrices(slug);
  if (!service) return notFound();

  return (
    <main className="">
      <div className="mx-auto max-w-screen-2xl px-6 pt-12 md:px-12 xl:px-20">
        {service.image && (
          <Image
            src={service.image}
            alt={service.title}
            width={1340}
            height={446}
            className="mb-8 h-64 w-full rounded-2xl object-cover md:h-80"
            priority
          />
        )}
        <div className="mt-28 grid gap-10 lg:grid-cols-[2fr_1fr] xl:grid-cols-[3fr_1fr]">
          {/* Service Details */}
          <section>
            <h1 className="mb-4 text-3xl font-bold text-primary lg:text-5xl">
              {service.title}
            </h1>
            <p className="mb-8 text-neutral-300 lg:text-lg">
              {service.summary}
            </p>
            <div className="prose prose-lg max-w-none text-[#1e1e1e]">
              {service.details.map((detail, i) =>
                service.serviceCode === "LANG" && i === 2 ? (
                  <div key={i} dangerouslySetInnerHTML={{ __html: detail }} />
                ) : service.serviceCode === "IADM" && i === 3 ? (
                  <div key={i} dangerouslySetInnerHTML={{ __html: detail }} />
                ) : (
                  <p key={i}>{detail}</p>
                ),
              )}
            </div>
          </section>

          {/* CTA Payment Section */}
          <PaymentSection service={service} slug={slug} />
        </div>
        <hr className="mt-24 border-t border-[#7f7f7f]" />
      </div>
    </main>
  );
}
