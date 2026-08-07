"use client";

import { openCookieSettings } from "@/lib/cookieConsent";

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => openCookieSettings()}
      className="rounded-xl bg-primary-300 px-6 py-2.5 text-sm font-semibold text-white duration-300 hover:bg-primary"
    >
      Manage Cookie Settings
    </button>
  );
}
