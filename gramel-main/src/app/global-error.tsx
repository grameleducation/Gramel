"use client";

import { useEffect } from "react";
import AppErrorState from "@/components/error-state/AppErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <AppErrorState
          title="The application hit an unexpected error"
          description="We couldn't finish loading the app. Please try again, or return home if the problem continues."
          onRetry={reset}
        />
      </body>
    </html>
  );
}
