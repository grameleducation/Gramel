"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import useCookieConsent from "@/hooks/useCookieConsent";
import { saveConsent } from "@/lib/cookieConsent";
import client_env from "@/utils/env.client";
import { useState } from "react";

export default function ApplyBoardIframe() {
  const [height, setHeight] = useState("auto");
  const isMobile = useIsMobile(768);
  const { functionalAllowed } = useCookieConsent();

  if (!functionalAllowed) {
    return (
      <div className="rounded-2xl bg-[#F5F6F8] p-10 text-center">
        <p className="text-neutral-500">
          This booking form needs functional cookies, which you&apos;ve
          turned off.
        </p>
        <button
          type="button"
          onClick={() => saveConsent(true)}
          className="mt-4 rounded-xl bg-primary-300 px-6 py-2.5 text-sm font-semibold text-white duration-300 hover:bg-primary"
        >
          Enable Functional Cookies
        </button>
      </div>
    );
  }

  return (
    <iframe
      src={`https://www.applyboard.com/partners/${client_env.NEXT_PUBLIC_APPLYBOARD_PARTNER_ID}/intake-form`}
      title="Consultation Booking Form"
      onLoad={() => setHeight(() => (isMobile ? "1400px" : "1600px"))}
      style={{ height }}
      className="w-full max-w-full border-none"
    />
  );
}
