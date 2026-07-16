import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { XIcon } from "lucide-react";
import Image from "next/image";

export default function ProofOfPaymentDialog({
  proofUrl,
}: {
  proofUrl: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="cursor-pointer text-primary duration-200 hover:text-primary-300 active:underline"
      >
        View Proof
      </button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTitle className="sr-only">
          Proof of Payment
        </AlertDialogTitle>
        <AlertDialogContent className="flex w-max justify-center border sm:max-w-xl lg:max-w-3xl xl:max-w-4xl">
          {/* Custom close button */}
          <button
            onClick={() => setIsDialogOpen(false)}
            className="absolute -top-4 -left-4 flex size-10 cursor-pointer items-center justify-center rounded-full bg-red-50 text-red-500 duration-300 hover:bg-red-100"
          >
            <XIcon className="size-5" />
          </button>

          <Image
            src={proofUrl}
            alt="Proof of Payment"
            onLoadingComplete={() => setIsLoading(false)}
            width={800}
            height={600}
            className={`max-h-[80vh] max-w-full rounded-lg bg-gray-100 object-contain ${isLoading ? "animate-pulse" : ""}`}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
