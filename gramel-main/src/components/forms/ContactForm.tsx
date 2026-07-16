"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import { FormTextArea, NewFormInput } from "./FormInput";
import SubmitButton from "./SubmitButton";
import useHCaptcha from "@/hooks/useHCaptcha";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "@/lib/zodSchemas";
import z from "zod";
import { sendContactPageMessageAction } from "@/app/(general-view)/contact/serverActions";
import { toast } from "sonner";

export default function ContactForm() {
  const { captchaToken, resetCaptcha, captchaProps } = useHCaptcha();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    shouldFocusError: true,
  });

  async function onSubmit(data: z.infer<typeof contactFormSchema>) {
    try {
      if (!captchaToken) {
        toast.error("Please complete the captcha verification");
        return;
      }

      // Send to server action
      const response = await sendContactPageMessageAction(data, captchaToken);

      if (!response.success) return toast.error(response.message);

      // If message sent successfully, reset form
      toast.success("Message sent successfully.", { duration: 3000 });
      reset();
      resetCaptcha();
    } catch (error) {
      toast.error("An error occurred sending your message. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4 lg:px-6"
    >
      <NewFormInput
        name="name"
        type="text"
        label="Full Name"
        placeholder="E.g. Givename Surname"
        autoComplete="name"
        register={register}
        error={errors.name}
      />

      <NewFormInput
        name="email"
        type="email"
        label="Email Address"
        placeholder="e.g. name@gmail.com"
        autoComplete="email"
        register={register}
        error={errors.email}
      />

      <NewFormInput
        name="subject"
        type="text"
        label="Subject"
        placeholder="Subject of your message"
        required={false}
        register={register}
        error={errors.subject}
      />

      <FormTextArea
        name="message"
        label="Description"
        placeholder="Message"
        register={register}
        error={errors.message}
      />

      <HCaptcha {...captchaProps} />

      <SubmitButton
        defaultText="Send Message"
        pendingText="Sending..."
        isPending={isSubmitting}
        disabled={!captchaToken}
      />
    </form>
  );
}
