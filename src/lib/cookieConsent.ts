// Shared cookie-consent state, read/written from multiple independent
// components (the banner, the footer's "Cookie Settings" link, and the
// widgets that are actually gated by it). Kept in localStorage with a
// CustomEvent broadcast on change, since those components don't share a
// parent that could hold this in React state.

export const COOKIE_CONSENT_KEY = "gramel-cookie-consent";
const CONSENT_CHANGE_EVENT = "gramel-cookie-consent-change";
const SETTINGS_OPEN_EVENT = "gramel-cookie-settings-open";

export interface CookieConsent {
  // Strictly necessary cookies (auth session, hCaptcha, Paystack) can't be
  // turned off -- the site can't function without them -- so this is only
  // here to render consistently in the settings UI, not a real toggle.
  necessary: true;
  // Third-party ApplyBoard widgets (homepage search + consultation form).
  // Not required for the rest of the site to work, so this is a genuine
  // on/off switch: turning it off stops those scripts/iframes from loading.
  functional: boolean;
}

const DEFAULT_CONSENT: CookieConsent = { necessary: true, functional: true };

export function getStoredConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONSENT, ...parsed, necessary: true };
  } catch {
    return null;
  }
}

export function saveConsent(functional: boolean) {
  const consent: CookieConsent = { necessary: true, functional };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  window.dispatchEvent(
    new CustomEvent<CookieConsent>(CONSENT_CHANGE_EVENT, { detail: consent }),
  );
}

export function onConsentChange(callback: (consent: CookieConsent) => void) {
  const handler = (e: Event) => callback((e as CustomEvent<CookieConsent>).detail);
  window.addEventListener(CONSENT_CHANGE_EVENT, handler);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handler);
}

// Lets the footer's "Cookie Settings" link reopen the banner at any time,
// even after it's been dismissed.
export function openCookieSettings() {
  window.dispatchEvent(new Event(SETTINGS_OPEN_EVENT));
}

export function onCookieSettingsOpen(callback: () => void) {
  window.addEventListener(SETTINGS_OPEN_EVENT, callback);
  return () => window.removeEventListener(SETTINGS_OPEN_EVENT, callback);
}
