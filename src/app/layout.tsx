import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Providers from "@/context/Providers";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://grameleducation.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Gramel Education | Study Abroad Agency in Abuja, Nigeria",
    template: "%s | Gramel Education",
  },
  description:
    "Gramel Education is a leading study abroad agency and company in Abuja, Nigeria, helping students across Nigeria access international education, student loans, scholarships, and visa support for the US, UK, Canada, Australia, and beyond.",
  keywords: [
    "Study Abroad agency in abuja",
    "Study Abroad company in abuja",
    "Study Abroad company in nigeria",
    "International Education",
    "Travel Agencies",
    "Study Abroad Agents In Nigeria",
    "Study Abroad agency in nigeria",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: "Gramel Education",
    title: "Gramel Education | Study Abroad Agency in Abuja, Nigeria",
    description:
      "Nigeria's trusted study abroad agency, based in Abuja. We guide students through international admissions, scholarships, student loans, and visa support.",
    images: [
      {
        url: "/gramel-education-logo.png",
        width: 1200,
        height: 630,
        alt: "Gramel Education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gramel Education | Study Abroad Agency in Abuja, Nigeria",
    description:
      "Nigeria's trusted study abroad agency, based in Abuja. We guide students through international admissions, scholarships, student loans, and visa support.",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "TravelAgency"],
  name: "Gramel Education",
  alternateName: "Gramel Education Abuja",
  url: SITE_URL,
  logo: `${SITE_URL}/gramel-education-logo.png`,
  description:
    "Gramel Education is a study abroad agency and company based in Abuja, Nigeria, providing international education placement, student loans, scholarships, visa assistance, and advisory services for students across Nigeria.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "50, Ebitu Ukiwe Street, Jabi",
    addressLocality: "Abuja",
    addressCountry: "NG",
  },
  telephone: "+2347041041810",
  email: "info@grameleducation.com",
  areaServed: {
    "@type": "Country",
    name: "Nigeria",
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${manrope.variable} bg-white font-manrope antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
