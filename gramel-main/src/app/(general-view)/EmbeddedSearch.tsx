"use client";

import { useEffect } from "react";

export default function EmbeddedSearch() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://www.applyboard.com/assets/embedded_search.js";
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="-mt-12.5 bg-[#F5F6F8]">
      <div
        id="ab-embedded-search"
        data-host="https://www.applyboard.com"
        data-rp-ref="44811"
        data-orientation="vertical"
        // data-default-countries="Canada,United Kingdom,Australia,Ireland"
        data-default-countries=""
      ></div>
    </div>
  );
}
