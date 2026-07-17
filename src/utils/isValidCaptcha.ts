import server_env from "@/utils/env.server";

export async function isValidHCaptcha(token: string): Promise<boolean> {
  if (!token.trim()) return false;

  try {
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: server_env.HCAPTCHA_SECRET_KEY!,
        response: token,
      }),
    });

    const captchaData = await response.json();

    return captchaData.success;
  } catch {
    return false;
  }
}
