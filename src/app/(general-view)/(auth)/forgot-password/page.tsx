import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";
import Image from "next/image";

export default function ForgotPasswordPage() {
  return (
    <main className="bg-gradient-to-br from-primary/5 via-white to-[#62A9DC]/5">
      <div className="container mx-auto flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Logo Section */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/gramel-education-logo.png"
              alt="Gramel Education logo"
              className="h-auto w-32"
              width={185}
              height={72}
              priority
            />
          </div>

          {/* Form */}
          <ForgotPasswordForm />

          {/* Footer Text */}
          <p className="mt-6 text-center text-sm text-[#626060]">
            Need help? Contact our support team at{" "}
            <a
              href="mailto:info@grameleducation.com"
              className="font-semibold text-primary hover:underline"
            >
              info@grameleducation.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
