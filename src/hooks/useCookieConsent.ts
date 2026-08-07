"use client";

import { useEffect, useState } from "react";
import {
  getStoredConsent,
  onConsentChange,
  type CookieConsent,
} from "@/lib/cookieConsent";

// Functional cookies (ApplyBoard widgets) default to allowed until the user
// explicitly opts out via Cookie Settings -- see cookieConsent.ts for why.
export default function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    setConsent(getStoredConsent());
    return onConsentChange(setConsent);
  }, []);

  return {
    functionalAllowed: consent?.functional ?? true,
  };
}
