"use client";

import { useEffect } from "react";
import useCookieConsent from "@/hooks/useCookieConsent";
import { saveConsent } from "@/lib/cookieConsent";

export default function EmbeddedSearch() {
  const { functionalAllowed } = useCookieConsent();

  useEffect(() => {
    if (!functionalAllowed) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://www.applyboard.com/assets/embedded_search.js";
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [functionalAllowed]);

  if (!functionalAllowed) {
    return (
      <div className="rounded-2xl bg-[#F5F6F8] p-10 text-center">
        <p className="text-neutral-500">
          This search tool needs functional cookies, which you&apos;ve
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
    <div className="-mt-12.5 overflow-x-hidden bg-[#F5F6F8]">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-12 xl:px-20">
        <div
          id="ab-embedded-search"
          data-host="https://www.applyboard.com"
          data-rp-ref="44811"
          data-orientation="vertical"
          // data-default-countries="Canada,United Kingdom,Australia,Ireland"
          data-default-countries=""
        ></div>
      </div>
    </div>
  );
}
