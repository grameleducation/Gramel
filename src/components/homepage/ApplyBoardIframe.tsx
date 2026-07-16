"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import client_env from "@/utils/env.client";
import { useState } from "react";

export default function ApplyBoardIframe() {
  const [height, setHeight] = useState("auto");
  const isMobile = useIsMobile(361);

  return (
    <iframe
      src={`https://www.applyboard.com/partners/${client_env.NEXT_PUBLIC_APPLYBOARD_PARTNER_ID}/intake-form`}
      title="ApplyBoard Form"
      onLoad={() => setHeight(() => (isMobile ? "2370px" : "1980px"))}
      style={{ height }}
      className="w-full border-none"
    />
  );
}
