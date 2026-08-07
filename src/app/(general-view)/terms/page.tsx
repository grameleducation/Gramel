import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and Conditions for using Gramel Education's website and study abroad advisory services.",
};

const LAST_UPDATED = "August 8, 2026";

export default function TermsPage() {
  return (
    <main className="pt-14">
      <section className="mx-auto max-w-4xl px-6 py-16 md:px-12">
        <h1 className="text-4xl font-bold text-primary md:text-5xl">
          Terms and Conditions
        </h1>
        <p className="mt-3 text-sm text-neutral-400">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose prose-lg mt-10 max-w-none text-[#1e1e1e]">
          <p>
            These Terms and Conditions (&quot;Terms&quot;) govern your access
            to and use of the Gramel Education website, located at{" "}
            <strong>grameleducation.com</strong> and its subdomains
            (collectively, the &quot;Platform&quot;), and the study abroad
            advisory services provided by Gramel Education (&quot;Gramel
            Education&quot;, &quot;we&quot;, &quot;us&quot;, or
            &quot;our&quot;). By creating an account, booking a consultation,
            purchasing a service, or otherwise using the Platform, you agree
            to be bound by these Terms. If you do not agree, please do not use
            the Platform.
          </p>

          <h2>1. Who We Are</h2>
          <p>
            Gramel Education is a study abroad agency and education
            management company based at 50, Ebitu Ukiwe Street, Jabi, Abuja,
            Nigeria. We help students find, apply to, and prepare for
            admission at international schools and universities, and provide
            guidance on scholarships, visas, and related services.
          </p>

          <h2>2. Eligibility and Account Registration</h2>
          <p>
            You must provide accurate, current, and complete information when
            creating an account or submitting a form on the Platform, and keep
            that information up to date. You are responsible for maintaining
            the confidentiality of your account credentials and for all
            activity that occurs under your account. If you are under 18,
            you may only use the Platform with the involvement and consent of
            a parent or legal guardian.
          </p>

          <h2>3. Our Services</h2>
          <p>Depending on the package you select, our services may include:</p>
          <ul>
            <li>
              Guidance on selecting schools, universities, and programs
              through our network of global education partners;
            </li>
            <li>
              Assistance with application preparation, document review, and
              submission;
            </li>
            <li>Advice on scholarship and funding opportunities;</li>
            <li>
              Visa application support, including document checklists and
              interview preparation;
            </li>
            <li>
              Registration support for language proficiency tests (e.g.
              IELTS, TOEFL, GRE, Duolingo English Test, PTE); and
            </li>
            <li>General advisory and pre-departure guidance.</li>
          </ul>

          <h2>4. No Guarantee of Outcomes</h2>
          <p>
            Gramel Education provides advisory and application-support
            services. We do not control, and cannot guarantee, the decisions
            of any university, scholarship provider, embassy, or visa
            authority. <strong>
              Admission, scholarship awards, and visa approvals are decided
              solely by the relevant institution or government authority
            </strong>{" "}
            and are never guaranteed by Gramel Education, regardless of the
            service package purchased. Fees paid to Gramel Education are for
            our advisory and application-support services rendered, not for a
            guaranteed outcome.
          </p>

          <h2>5. Fees, Payments, and Refunds</h2>
          <p>
            Service fees are shown on the relevant service page at the time
            of purchase and are payable in Nigerian Naira (₦) unless stated
            otherwise. Payments are processed securely through our
            third-party payment processor, Paystack; Gramel Education does
            not store your full card details. Because our services involve
            immediate allocation of advisor time and, in many cases,
            third-party application fees paid on your behalf, fees are
            generally non-refundable once work has commenced on your file.
            Where a refund is agreed at our discretion, it will be processed
            to the original payment method within a reasonable time.
          </p>

          <h2>6. Your Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>
              Provide truthful, accurate, and complete documents and
              information for your application;
            </li>
            <li>
              Respond to requests from our team, your chosen institutions, or
              visa authorities in a timely manner;
            </li>
            <li>
              Comply with the rules, deadlines, and requirements of any
              school, scholarship provider, or government authority you
              apply to; and
            </li>
            <li>
              Use the Platform only for lawful purposes and not misrepresent
              your identity or qualifications.
            </li>
          </ul>
          <p>
            Gramel Education is not liable for delays, rejections, or adverse
            outcomes caused by inaccurate information you provide, missed
            deadlines on your part, or changes in third-party policy beyond
            our control.
          </p>

          <h2>7. Third-Party Services and Links</h2>
          <p>
            The Platform integrates or links to third-party services,
            including our partner search and consultation tools provided by
            ApplyBoard, payment processing by Paystack, and bot-verification
            by hCaptcha. Your use of those third-party services is also
            governed by their own terms and privacy policies, which we
            encourage you to review. We are not responsible for the content,
            accuracy, or practices of third-party websites or services.
          </p>

          <h2>8. Intellectual Property</h2>
          <p>
            All content on the Platform -- including text, graphics, logos,
            and the Gramel Education name and branding -- is owned by or
            licensed to Gramel Education and is protected by applicable
            intellectual property laws. You may not copy, reproduce,
            distribute, or create derivative works from our content without
            prior written permission, except as necessary to use the
            Platform for its intended purpose.
          </p>

          <h2>9. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>
              Attempt to gain unauthorized access to the Platform, other
              users&apos; accounts, or our systems;
            </li>
            <li>
              Upload malicious code, or interfere with the normal operation
              of the Platform;
            </li>
            <li>
              Scrape, harvest, or misuse data from the Platform outside of
              your own account use; or
            </li>
            <li>
              Use the Platform to submit fraudulent applications or
              documents.
            </li>
          </ul>

          <h2>10. Termination</h2>
          <p>
            We may suspend or terminate your account if you breach these
            Terms, provide false information, or misuse the Platform. You
            may stop using the Platform and request account deletion at any
            time by contacting us; this does not entitle you to a refund for
            services already rendered.
          </p>

          <h2>11. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Gramel Education will not
            be liable for any indirect, incidental, or consequential damages
            arising from your use of the Platform or our services, including
            loss of admission, scholarship, or visa opportunities. Our total
            liability for any claim relating to a paid service will not
            exceed the amount you paid for that specific service.
          </p>

          <h2>12. Indemnification</h2>
          <p>
            You agree to indemnify and hold Gramel Education harmless from
            any claims, losses, or expenses arising from your breach of
            these Terms, your misuse of the Platform, or false information
            you provide.
          </p>

          <h2>13. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Federal Republic of
            Nigeria. Any dispute arising from these Terms or your use of the
            Platform will be subject to the exclusive jurisdiction of the
            courts of the Federal Capital Territory, Abuja, Nigeria.
          </p>

          <h2>14. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes
            will be reflected by an updated &quot;Last updated&quot; date
            above. Continued use of the Platform after changes take effect
            constitutes acceptance of the revised Terms.
          </p>

          <h2>15. Contact Us</h2>
          <p>
            If you have questions about these Terms, contact us at{" "}
            <a href="mailto:info@grameleducation.com">
              info@grameleducation.com
            </a>
            , by phone at 07041041810, or by mail at 50, Ebitu Ukiwe Street,
            Jabi, Abuja, Nigeria.
          </p>

          <p>
            See also our{" "}
            <Link href="/privacy" prefetch={false}>
              Privacy Policy
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
