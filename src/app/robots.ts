import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://grameleducation.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/student-profile", "/programs", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
