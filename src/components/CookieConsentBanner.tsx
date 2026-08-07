"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getStoredConsent,
  saveConsent,
  onCookieSettingsOpen,
} from "@/lib/cookieConsent";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [functionalDraft, setFunctionalDraft] = useState(true);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) setIsVisible(true);

    // Reopen (pre-filled with the current choice) when the footer's "Cookie
    // Settings" link is clicked, even if the banner was already dismissed.
    return onCookieSettingsOpen(() => {
      setFunctionalDraft(getStoredConsent()?.functional ?? true);
      setIsCustomizing(true);
      setIsVisible(true);
    });
  }, []);

  function accept(functional: boolean) {
    saveConsent(functional);
    setIsVisible(false);
    setIsCustomizing(false);
  }

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:p-6">
      <div className="mx-auto max-w-screen-2xl">
        {!isCustomizing ? (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-center text-sm text-neutral-500 sm:text-left">
              We use cookies that are necessary for the site to work, and
              optional ones that power the embedded ApplyBoard search and
              consultation tools. Read our{" "}
              <Link
                href="/cookie-policy"
                prefetch={false}
                className="font-semibold text-primary-300 hover:underline"
              >
                Cookie Policy
              </Link>
              .
            </p>

            <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsCustomizing(true)}
                className="text-sm font-semibold text-neutral-500 underline hover:text-primary-300"
              >
                Customize
              </button>
              <button
                type="button"
                onClick={() => accept(false)}
                className="rounded-xl border-2 border-primary-300 px-5 py-2.5 text-sm font-semibold text-primary-300 duration-300 hover:bg-primary-300 hover:text-white"
              >
                Necessary Only
              </button>
              <button
                type="button"
                onClick={() => accept(true)}
                className="rounded-xl bg-primary-300 px-5 py-2.5 text-sm font-semibold text-white duration-300 hover:bg-primary"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-black">Cookie Settings</h2>
                <p className="mt-1 text-sm text-neutral-400">
                  Choose which cookies grameleducation.com can use. See the
                  full breakdown in our{" "}
                  <Link
                    href="/cookie-policy"
                    prefetch={false}
                    className="font-semibold text-primary-300 hover:underline"
                  >
                    Cookie Policy
                  </Link>
                  .
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomizing(false)}
                aria-label="Back"
                className="shrink-0 text-sm font-semibold text-neutral-400 hover:text-neutral-600"
              >
                Back
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div>
                  <p className="font-semibold text-black">
                    Strictly Necessary
                  </p>
                  <p className="text-sm text-neutral-400">
                    Keeps you signed in and processes payments securely.
                    Always on.
                  </p>
                </div>
                <div className="shrink-0 rounded-full bg-neutral-300 px-4 py-1 text-xs font-semibold text-white">
                  Always On
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
                <div>
                  <p className="font-semibold text-black">Functional</p>
                  <p className="text-sm text-neutral-400">
                    Powers the embedded ApplyBoard school search and
                    consultation booking tools. Turning this off will hide
                    those tools.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={functionalDraft}
                  onClick={() => setFunctionalDraft((v) => !v)}
                  className={`relative h-7 w-12 shrink-0 rounded-full duration-300 ${
                    functionalDraft ? "bg-primary-300" : "bg-neutral-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 size-5 rounded-full bg-white duration-300 ${
                      functionalDraft ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => accept(false)}
                className="rounded-xl border-2 border-primary-300 px-5 py-2.5 text-sm font-semibold text-primary-300 duration-300 hover:bg-primary-300 hover:text-white"
              >
                Necessary Only
              </button>
              <button
                type="button"
                onClick={() => accept(functionalDraft)}
                className="rounded-xl bg-primary-300 px-5 py-2.5 text-sm font-semibold text-white duration-300 hover:bg-primary"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
