"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "gramel-cookie-consent";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setIsVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(CONSENT_KEY, "acknowledged");
    setIsVisible(false);
  }

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:p-6">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-neutral-500 sm:text-left">
          We use cookies that are necessary for the site to work -- keeping
          you signed in, processing payments securely, and powering the
          embedded program search and consultation tools. Read our{" "}
          <Link
            href="/cookie-policy"
            prefetch={false}
            className="font-semibold text-primary-300 hover:underline"
          >
            Cookie Policy
          </Link>{" "}
          to learn more.
        </p>

        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-xl bg-primary-300 px-6 py-2.5 text-sm font-semibold text-white duration-300 hover:bg-primary"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
