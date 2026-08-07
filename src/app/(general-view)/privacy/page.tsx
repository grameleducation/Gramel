import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Gramel Education collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "August 8, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="pt-14">
      <section className="mx-auto max-w-4xl px-6 py-16 md:px-12">
        <h1 className="text-4xl font-bold text-primary md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-neutral-400">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose prose-lg mt-10 max-w-none text-[#1e1e1e]">
          <p>
            Gramel Education (&quot;Gramel Education&quot;, &quot;we&quot;,
            &quot;us&quot;, or &quot;our&quot;) respects your privacy and is
            committed to protecting your personal information. This Privacy
            Policy explains what information we collect, how we use it, who
            we share it with, and the choices and rights you have, in
            connection with your use of grameleducation.com and its
            subdomains (the &quot;Platform&quot;).
          </p>
          <p>
            We process personal data in accordance with the Nigeria Data
            Protection Act 2023 (NDPA) and, where applicable to visitors
            outside Nigeria, we apply the same principles of fairness,
            transparency, and data minimization reflected in regulations
            such as the GDPR.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We collect information in the following ways:</p>
          <ul>
            <li>
              <strong>Information you give us directly</strong>, such as your
              name, email address, phone number, and message when you submit
              a contact form, book a free consultation, or create an account;
            </li>
            <li>
              <strong>Account and student profile information</strong>,
              including academic history, documents you upload (e.g.
              transcripts, passport details, statements of purpose), and your
              application progress, if you register for a student account;
            </li>
            <li>
              <strong>Payment information</strong>, processed on our behalf by
              our payment processor, Paystack, when you pay for a service.
              Gramel Education does not receive or store your full card
              number;
            </li>
            <li>
              <strong>Communications</strong> you have with our team by
              email, phone, or through the Platform; and
            </li>
            <li>
              <strong>Technical and usage information</strong>, such as your
              IP address, browser type, and pages visited, collected
              automatically through cookies and similar technologies -- see
              our{" "}
              <Link href="/cookie-policy" prefetch={false}>
                Cookie Policy
              </Link>{" "}
              for details.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide, operate, and improve our advisory services;</li>
            <li>
              Respond to your enquiries and process your consultation
              bookings and service purchases;
            </li>
            <li>
              Prepare and submit applications on your behalf to schools,
              scholarship providers, and, where relevant, support your visa
              application;
            </li>
            <li>
              Send you service-related communications, including onboarding
              and status updates (you may opt out of non-essential marketing
              communications at any time);
            </li>
            <li>Process payments and maintain financial records;</li>
            <li>
              Detect, prevent, and address fraud, abuse, or security issues
              (including through hCaptcha bot verification); and
            </li>
            <li>Comply with our legal and regulatory obligations.</li>
          </ul>

          <h2>3. Who We Share Your Information With</h2>
          <p>
            We do not sell your personal information. We share it only where
            necessary to provide our services or where required by law,
            including with:
          </p>
          <ul>
            <li>
              <strong>Schools, universities, and scholarship providers</strong>{" "}
              you choose to apply to, as needed to process your application;
            </li>
            <li>
              <strong>ApplyBoard</strong>, our education partner platform,
              which powers the school search widget and consultation booking
              tool embedded on our Platform;
            </li>
            <li>
              <strong>Paystack</strong>, to process payments for our
              services;
            </li>
            <li>
              <strong>hCaptcha</strong>, to verify that form submissions are
              made by a human and not automated software;
            </li>
            <li>
              <strong>Service providers</strong> who support our operations,
              such as our email delivery, hosting, and database providers,
              under confidentiality obligations; and
            </li>
            <li>
              <strong>Regulators or authorities</strong>, where required to
              comply with a legal obligation, such as visa-related
              verification requests you have authorized.
            </li>
          </ul>

          <h2>4. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to
            provide our services, maintain your account, and comply with our
            legal, accounting, and reporting obligations. If you close your
            account or ask us to delete your data, we will do so unless we
            are required to retain certain records (for example, financial
            records) for a longer period under applicable law.
          </p>

          <h2>5. Data Security</h2>
          <p>
            We use reasonable technical and organizational measures --
            including encrypted connections, access controls, and secure
            third-party payment processing -- to protect your personal
            information. No method of transmission or storage is completely
            secure, and we cannot guarantee absolute security.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            Subject to applicable law, you have the right to request access
            to, correction of, or deletion of your personal information;
            object to or restrict certain processing; and request a copy of
            your data in a portable format. To exercise any of these rights,
            contact us at{" "}
            <a href="mailto:info@grameleducation.com">
              info@grameleducation.com
            </a>
            . We will respond within a reasonable time and in accordance with
            applicable law.
          </p>

          <h2>7. Children&apos;s Privacy</h2>
          <p>
            Our services are intended for prospective students who are
            typically applying to post-secondary institutions. Where a user
            is under 18, we expect the involvement and consent of a parent
            or legal guardian. If you believe a child has provided us with
            personal information without appropriate consent, contact us and
            we will take steps to remove it.
          </p>

          <h2>8. International Data Transfers</h2>
          <p>
            Because we help place students at institutions abroad, your
            information may be transferred to and processed in countries
            outside Nigeria, including the destination country of your
            application and the jurisdictions where our service providers
            operate. Where required, we take steps to ensure such transfers
            are subject to appropriate safeguards.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material
            changes will be reflected by an updated &quot;Last updated&quot;
            date above. We encourage you to review this page periodically.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or how we handle
            your personal information, contact us at{" "}
            <a href="mailto:info@grameleducation.com">
              info@grameleducation.com
            </a>
            , by phone at 07041041810, or by mail at 50, Ebitu Ukiwe Street,
            Jabi, Abuja, Nigeria.
          </p>

          <p>
            See also our{" "}
            <Link href="/terms" prefetch={false}>
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="/cookie-policy" prefetch={false}>
              Cookie Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
