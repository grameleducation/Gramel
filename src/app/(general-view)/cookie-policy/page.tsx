import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Gramel Education uses cookies and similar technologies on grameleducation.com.",
};

const LAST_UPDATED = "August 8, 2026";

export default function CookiePolicyPage() {
  return (
    <main className="pt-14">
      <section className="mx-auto max-w-4xl px-6 py-16 md:px-12">
        <h1 className="text-4xl font-bold text-primary md:text-5xl">
          Cookie Policy
        </h1>
        <p className="mt-3 text-sm text-neutral-400">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose prose-lg mt-10 max-w-none text-[#1e1e1e]">
          <p>
            This Cookie Policy explains what cookies are, how Gramel
            Education uses them on grameleducation.com and its subdomains
            (the &quot;Platform&quot;), and the choices available to you. It
            should be read alongside our{" "}
            <Link href="/privacy" prefetch={false}>
              Privacy Policy
            </Link>
            .
          </p>

          <h2>1. What Are Cookies</h2>
          <p>
            Cookies are small text files placed on your device when you visit
            a website. They help the website function, remember your
            preferences, and, on some sites, understand how visitors use it.
            Similar technologies -- such as data stored by embedded
            third-party widgets -- are covered by this policy as well.
          </p>

          <h2>2. Do We Use Analytics or Advertising Cookies?</h2>
          <p>
            <strong>No.</strong> As of the date above, Gramel Education does
            not use analytics, advertising, or tracking cookies of our own,
            and we do not run marketing pixels on the Platform. Every cookie
            currently set on the Platform is either strictly necessary for it
            to function or set by an embedded third-party tool that provides
            a feature you&apos;ve chosen to use (like searching for a
            program). If that changes in the future, we will update this
            policy and, where required, ask for your consent before those
            cookies are set.
          </p>

          <h2>3. Cookies We Use</h2>

          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Purpose</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>better-auth.session_token (and related)</td>
                <td>
                  Keeps you signed in to your student or staff account and
                  protects access to pages like your student profile and the
                  admin dashboard.
                </td>
                <td>Strictly necessary</td>
              </tr>
              <tr>
                <td>hCaptcha cookies</td>
                <td>
                  Set when you submit the contact form or sign-up form, to
                  verify you&apos;re a human and block spam and abuse.
                </td>
                <td>Strictly necessary (third-party)</td>
              </tr>
              <tr>
                <td>ApplyBoard widget cookies</td>
                <td>
                  Set by the embedded ApplyBoard school search and
                  consultation booking tools on our homepage, to make those
                  tools function correctly.
                </td>
                <td>Functional (third-party)</td>
              </tr>
              <tr>
                <td>Paystack cookies</td>
                <td>
                  Set during checkout to securely process your payment for a
                  service.
                </td>
                <td>Strictly necessary (third-party)</td>
              </tr>
              <tr>
                <td>gramel-cookie-consent</td>
                <td>
                  Remembers that you&apos;ve seen and dismissed our cookie
                  notice, so it doesn&apos;t show again on your next visit.
                </td>
                <td>Strictly necessary</td>
              </tr>
            </tbody>
          </table>

          <h2>4. Why We Don&apos;t Offer a Cookie Toggle</h2>
          <p>
            Because every cookie on the Platform today is either required for
            core functionality (staying signed in, processing payment
            securely, blocking spam) or set by a third-party tool you&apos;ve
            actively chosen to use (searching for a program, booking a
            consultation), there are currently no optional analytics or
            marketing cookies for you to switch off. Our cookie notice is
            therefore an acknowledgement of this policy rather than a
            granular opt-in/opt-out control. You can still control cookies
            directly through your browser settings, as described below.
          </p>

          <h2>5. Managing Cookies in Your Browser</h2>
          <p>
            Most browsers let you block or delete cookies through their
            settings. Note that blocking strictly necessary cookies (for
            example, the session cookie) will prevent you from staying
            signed in, and blocking third-party widget cookies may prevent
            the school search or consultation booking tools from working
            correctly.
          </p>
          <ul>
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
              >
                Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>

          <h2>6. Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy as the tools and features on our
            Platform change. Material changes will be reflected by an
            updated &quot;Last updated&quot; date above, and, where we
            introduce new non-essential cookies, we will update our cookie
            notice to ask for your consent.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            Questions about this Cookie Policy can be sent to{" "}
            <a href="mailto:info@grameleducation.com">
              info@grameleducation.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
