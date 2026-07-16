import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

interface SubmitButtonProps {
  isPending: boolean;
  pendingText: string;
  defaultText: string;
  className?: string;
  disabled?: boolean;
}

export default function SubmitButton({
  isPending = false,
  pendingText = "",
  defaultText,
  className,
  disabled = false,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isPending || disabled}
      className={cn(
        "mt-6 flex w-full items-center justify-center rounded-[0.625rem] bg-primary p-4 text-white transition-colors duration-200 hover:bg-[#62A9DC] focus:bg-[#62A9DC] active:bg-primary disabled:cursor-not-allowed disabled:bg-[#62A9DC] disabled:opacity-70",
        className,
      )}
    >
      {isPending ? (
        <>
          <LoaderCircle className="mr-2 size-5 animate-spin" /> {pendingText}
        </>
      ) : (
        defaultText
      )}
    </button>
  );
}
