"use client";

import PaymentButton from "./PaymentButton";
import { Suspense } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { ServiceDetail } from "./types";
import { InfoIcon, CreditCardIcon, LoaderCircle } from "lucide-react";
import numeral from "numeral";
import { nairaSign } from "@/utils";
import { BsBank2 } from "react-icons/bs";

function hasTestsArray(
  service: ServiceDetail,
): service is ServiceDetail & { tests: { name: string; price: number }[] } {
  return Array.isArray(service.tests) && service.tests.length > 0;
}

function hasApplicationOptions(
  service: ServiceDetail,
): service is ServiceDetail & {
  applicationOptions: { name: string; price: number }[];
} {
  return (
    Array.isArray(service.applicationOptions) &&
    service.applicationOptions.length > 0
  );
}

export default function PaymentSection({
  service,
  slug,
}: {
  service: ServiceDetail;
  slug: string;
}) {
  const isLanguageTest = hasTestsArray(service);
  const isAdmissions = hasApplicationOptions(service);

  const [selectedTest, setSelectedTest] = useState(
    isLanguageTest ? service.tests[0].name : undefined,
  );
  const [selectedApplication, setSelectedApplication] = useState(
    isAdmissions ? service.applicationOptions[0].name : undefined,
  );
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  const selectedPrice = isLanguageTest
    ? (service.tests.find((t) => t.name === selectedTest)?.price ?? 0)
    : isAdmissions
      ? (service.applicationOptions.find((o) => o.name === selectedApplication)
          ?.price ?? 0)
      : service.price;

  const selectedOptionName = isLanguageTest
    ? selectedTest
    : isAdmissions
      ? selectedApplication
      : undefined;

  return (
    <aside className="flex flex-col items-center justify-center rounded-2xl bg-[#F2F5FF] p-6 shadow-md">
      <h2 className="mb-4 text-center text-2xl font-bold text-primary">
        Ready to Get Started?
      </h2>
      <p className="mb-6 text-center text-neutral-500">
        Begin your journey with our {service.title} service. Secure your spot
        now!
      </p>

      {isLanguageTest && (
        <div className="mb-8 w-full">
          <label
            htmlFor="test-select"
            className="mb-2 flex items-center gap-2 text-base font-semibold whitespace-nowrap text-primary"
          >
            <InfoIcon className="size-4" />
            Select the test you want to pay for:
          </label>
          <Select
            value={selectedTest}
            onValueChange={setSelectedTest}
            name="test-select"
          >
            <SelectTrigger className="w-full border-2 border-primary bg-primary-300/20 font-semibold text-primary shadow-xs transition-all focus:border-primary focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Select a test" />
            </SelectTrigger>
            <SelectContent>
              {service.tests.map((test) => (
                <SelectItem key={test.name} value={test.name}>
                  {test.name} (₦{(test.price / 100).toLocaleString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <small className="mt-2 text-sm font-medium whitespace-nowrap text-primary-300">
            The price will update based on your selection.
          </small>
        </div>
      )}

      {isAdmissions && (
        <div className="mb-8 w-full">
          <label
            htmlFor="application-select"
            className="mb-2 flex items-center gap-2 text-base font-semibold whitespace-nowrap text-primary"
          >
            <InfoIcon className="size-4" />
            Select your application package:
          </label>
          <Select
            value={selectedApplication}
            onValueChange={setSelectedApplication}
            name="application-select"
          >
            <SelectTrigger className="w-full border-2 border-primary bg-primary-300/20 font-semibold text-primary shadow-xs transition-all focus:border-primary focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {service.applicationOptions.map((option) => (
                <SelectItem key={option.name} value={option.name}>
                  {option.name} (₦{numeral(option.price / 100).format("0,0")})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <small className="mt-2 text-sm font-medium whitespace-nowrap text-primary-300">
            The price will update based on your selection.
          </small>
        </div>
      )}

      <div className="mb-4 w-full text-center">
        <p className="text-sm font-semibold text-primary">
          Amount to pay: ₦{numeral(selectedPrice / 100).format("0,0")}
        </p>
      </div>

      <AlertDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
      >
        <AlertDialogTrigger asChild>
          <button className="flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 text-center text-lg font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-primary-300">
            Make payment
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent
          className="lg:max-w-4xl"
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Choose a payment method</AlertDialogTitle>
            <AlertDialogDescription>
              Use one of the options below to pay for this service.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto_1fr]">
            <div className="bg-primary-50 flex flex-col gap-3 rounded-lg border border-primary p-4">
              <div className="flex items-center gap-2">
                <BsBank2 className="size-5 text-primary" />
                <h3 className="text-base font-semibold text-primary">
                  Offline payment (bank transfer)
                </h3>
              </div>
              <p className="text-sm text-neutral-600">
                Pay{" "}
                <strong>
                  {nairaSign}
                  {numeral(selectedPrice / 100).format("0,0")}{" "}
                </strong>
                to the bank account below, then email us your proof of payment.
              </p>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-semibold text-neutral-800">
                    Step 1: Make payment
                  </p>
                  <p className="text-neutral-700">
                    Account name:{" "}
                    <span className="font-semibold">
                      Gramel Destinations Limited
                    </span>
                  </p>
                  <p className="text-neutral-700">
                    Account number:{" "}
                    <span className="font-semibold">1017607523</span>
                  </p>
                  <p className="text-neutral-700">
                    Bank: <span className="font-semibold">Zenith Bank</span>
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-neutral-800">
                    Step 2: Send proof of payment
                  </p>
                  <p className="text-neutral-700">
                    Email your proof of payment (payment slip, receipt or
                    screenshot) to{" "}
                    <a
                      href="mailto:info@grameleducation.com"
                      className="font-semibold text-primary underline"
                    >
                      info@grameleducation.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <span className="text-sm font-medium text-neutral-500">OR</span>
            </div>

            <div className="flex h-full flex-col gap-3 rounded-lg border border-primary bg-white p-4">
              <div className="flex items-center gap-2">
                <CreditCardIcon className="size-5 text-primary" />
                <h3 className="text-base font-semibold text-primary">
                  Online payment (Paystack)
                </h3>
              </div>
              <p className="text-sm text-neutral-600">
                Pay securely online using Paystack. Your payment will be
                processed instantly.
              </p>
              <div className="flex-grow"></div>
              <Suspense>
                <PaymentButton
                  serviceSlug={slug}
                  price={selectedPrice}
                  selectedOptionName={selectedOptionName}
                  closePaymentDialog={() => setIsPaymentDialogOpen(false)}
                  onVerificationStateChange={setIsVerifyingPayment}
                />
              </Suspense>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="border-primary text-primary hover:cursor-pointer hover:bg-transparent">
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isVerifyingPayment}>
        <AlertDialogContent
          className="sm:max-w-lg"
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Verifying your payment
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Please wait while we confirm your transaction. Do not close this
              page or try to start another payment.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col items-center gap-4 pb-4 text-center">
            <LoaderCircle className="size-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-neutral-700">
              Payment verification is in progress.
            </p>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
