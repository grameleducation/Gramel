import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function useErrorToast({
  title = "Error!",
  description = "An error occured...",
  refetch,
  error,
}: {
  title?: string;
  description?: string;
  refetch: () => void;
  error: Error | null;
}) {
  const toastIdRef = useRef<string | number | null>(null);

  // manage toast w.r.t error
  useEffect(() => {
    if (error) {
      toastIdRef.current = toast.error(title, {
        description,
        position: "bottom-right",
        duration: Infinity,
        className: "bg-red-500! border-red-500! w-auto! text-nowrap gap-4!",
        classNames: {
          title: "font-bold!",
          content: "text-white",
          description: "text-base",
          actionButton:
            "bg-white! text-red-500! text-base! px-3! h-auto! py-1!",
          closeButton: "bg-white! text-red-500! border-red-500!",
        },
        icon: null,
        action: {
          label: "retry",
          onClick() {
            refetch();
          },
        },
      });
    } else if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current); // dismiss existing toast when error is falsy
      toastIdRef.current = null; // reset ref
    }
  }, [error]);
}
