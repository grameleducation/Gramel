"use client";

import { useState } from "react";
import { toast } from "sonner";
import { initializePayment, verifyTransaction } from "./serverActions";
import { LoaderCircle } from "lucide-react";
import numeral from "numeral";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface PaymentButtonProps {
  serviceSlug: string;
  price: number;
  selectedOptionName?: string;
  closePaymentDialog?: () => void;
  onVerificationStateChange?: (isVerifying: boolean) => void;
}

export default function PaymentButton({
  serviceSlug,
  price,
  selectedOptionName,
  closePaymentDialog,
  onVerificationStateChange,
}: PaymentButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      if (!user) {
        return void toast.error("User not found. Please log in to continue.", {
          className: "w-auto! text-nowrap gap-4! z-90! pointer-events-auto!",
          classNames: {
            title: "font-bold!",
            description: "text-base",
            actionButton:
              "bg-white! font-bold! text-red-900! text-base! px-3! h-auto! py-1! cursor-pointer!",
          },
          icon: null,
          action: {
            label: "Log in",
            onClick() {
              router.push("/login");
            },
          },
        });
      }

      const result = await initializePayment(serviceSlug, selectedOptionName);

      if (!result.success) {
        toast.error(result.error || "Payment initialization failed");
        return;
      }

      if (result.accessCode) {
        // Dynamically import the paystack package because it needs window object which is not available during rendering
        const PaystackPopup = (await import("@paystack/inline-js")).default;
        const paystack = new PaystackPopup();

        closePaymentDialog?.();
        await new Promise((resolve) => window.setTimeout(resolve, 100));

        paystack.resumeTransaction(result.accessCode, {
          onSuccess: async (tranx) => {
            onVerificationStateChange?.(true);
            try {
              // Verify the transaction using the server action
              const verificationResult = await verifyTransaction(
                tranx.reference,
              );

              if (verificationResult.success) {
                toast.success(
                  "Payment successful! We'll contact you soon with next steps.",
                );
              } else {
                toast.error(
                  verificationResult.error || "Payment verification failed",
                );
              }
            } catch {
              toast.error(
                "Payment verification failed. Please contact support.",
              );
            } finally {
              onVerificationStateChange?.(false);
            }
          },

          onCancel: function () {
            toast.error("Payment was cancelled. You can try again.");
          },

          onError: function () {
            toast.error("Payment failed. Please try again.");
          },
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-center text-lg font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <LoaderCircle className="size-5 animate-spin" /> Initializing
          payment...
        </>
      ) : (
        `Pay ₦${numeral(price / 100).format("0,0")}`
      )}
    </button>
  );
}
