import { MetadataRoute } from "next";
import { client } from "@/lib/sanity/client";
import { isSanityConfigured } from "@/lib/sanity/env";
import { postsQuery } from "@/lib/sanity/queries";
import { servicesDetails } from "@/app/(general-view)/services/[slug]/servicesData";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://grameleducation.com";

const STATIC_ROUTES = [
  "",
  "/about-us",
  "/services",
  "/programs",
  "/contact",
  "/assist",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const serviceEntries: MetadataRoute.Sitemap = Object.keys(
    servicesDetails,
  ).map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  if (!isSanityConfigured) return [...staticEntries, ...serviceEntries];

  const posts = await client.fetch<{ slug: string; publishedAt: string }[]>(
    postsQuery,
    { category: "" },
  );

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/assist/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...postEntries];
}
