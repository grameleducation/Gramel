import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import PaymentSection from "./PaymentSection";
import { servicesDetails } from "./servicesData";
import pool from "@/utils/db";
import tryCatch from "@/utils/tryCatch";
import type { ServiceDetail } from "./types";

export const revalidate = 3600; // revalidate once in one hour

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://grameleducation.com";

export async function generateStaticParams() {
  return Object.keys(servicesDetails).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesDetails[slug];
  if (!service) return {};

  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `${SITE_URL}/services/${slug}` },
    openGraph: {
      title: `${service.title} | Gramel Education`,
      description: service.summary,
      url: `${SITE_URL}/services/${slug}`,
      images: service.image ? [{ url: service.image }] : undefined,
    },
  };
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

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    name: `${service.title} | Gramel Education`,
    description: service.summary,
    provider: {
      "@type": "EducationalOrganization",
      name: "Gramel Education",
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    url: `${SITE_URL}/services/${slug}`,
  };

  return (
    <main className="bg-gradient-to-b from-white to-neutral-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <div className="mx-auto max-w-screen-2xl px-6 pt-12 md:px-12 xl:px-20">
        {service.image && (
          <div className="mb-12 overflow-hidden rounded-3xl shadow-lg">
            <Image
              src={service.image}
              alt={service.title}
              width={1340}
              height={446}
              className="h-64 w-full object-cover transition-transform duration-300 hover:scale-105 md:h-96"
              priority
            />
          </div>
        )}
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr] xl:grid-cols-[3fr_1.2fr]">
          {/* Service Details */}
          <section>
            <div className="mb-8">
              <p className="mb-2 inline-block rounded-full bg-primary-300/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-300">
                {service.serviceCode}
              </p>
              <h1 className="mb-4 text-4xl font-bold text-primary lg:text-5xl">
                {service.title}
              </h1>
              <p className="text-lg text-neutral-600 lg:text-xl">
                {service.summary}
              </p>
            </div>
            <div className="space-y-6 text-neutral-700">
              {service.details.map((detail, i) =>
                service.serviceCode === "LANG" && i === 2 ? (
                  <div key={i} className="prose prose-sm max-w-none lg:prose-base" dangerouslySetInnerHTML={{ __html: detail }} />
                ) : service.serviceCode === "IADM" && i === 3 ? (
                  <div key={i} className="prose prose-sm max-w-none lg:prose-base" dangerouslySetInnerHTML={{ __html: detail }} />
                ) : (
                  <p key={i} className="leading-relaxed">
                    {detail}
                  </p>
                ),
              )}
            </div>
          </section>

          {/* CTA Payment Section */}
          <PaymentSection service={service} slug={slug} />
        </div>
        <div className="mt-20 border-t border-neutral-200" />
      </div>
    </main>
  );
}
