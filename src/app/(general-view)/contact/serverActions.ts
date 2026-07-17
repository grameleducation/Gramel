"use server";

import { contactPageMessage } from "@/lib/emailTemplates";
import { contactFormSchema } from "@/lib/zodSchemas";
import transporter from "@/utils/emailTransporter";
import server_env from "@/utils/env.server";
import { z } from "zod";

export async function sendContactPageMessageAction(
  data: z.infer<typeof contactFormSchema>,
  captchaToken: string,
) {
  try {
    if (!captchaToken)
      return {
        success: false,
        message: "Please complete the captcha verification",
      };

    // Validate data
    const validatedData = contactFormSchema.parse(data);

    // confirm captcha token with google
    const response = await fetch(`https://api.hcaptcha.com/siteverify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: server_env.HCAPTCHA_SECRET_KEY!,
        response: captchaToken,
      }),
    });

    if (!response.ok)
      return {
        success: false,
        message: "An error occurred...",
      };

    // notABot = success = true if user is not a bot
    const notABot = (await response.json()).success;
    if (!notABot)
      return {
        success: false,
        message: "An error occurred...",
      };

    // Send email
    await transporter.sendMail({
      from: server_env.SMTP_USER,
      to: server_env.SMTP_USER, // Send to yourself
      subject: validatedData.subject || contactPageMessage.subject,
      text: contactPageMessage.text(validatedData),
      html: contactPageMessage.html(validatedData),
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Invalid data",
      };
    }
    return {
      success: false,
      message: "An error occurred sending your message.",
    };
  }
}
