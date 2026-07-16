import { useRef, useState } from "react";
import type HCaptcha from "@hcaptcha/react-hcaptcha";
import client_env from "@/utils/env.client";

export default function useHCaptcha() {
  const captchaRef = useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const resetCaptcha = () => {
    captchaRef.current?.resetCaptcha();
    setCaptchaToken(null);
  };

  const captchaProps = {
    ref: captchaRef,
    sitekey: client_env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY,
    onVerify: (token: string) => setCaptchaToken(token),
    onExpire: () => setCaptchaToken(null),
    onError: () => setCaptchaToken(null),
  };

  return { captchaToken, resetCaptcha, captchaProps };
}
