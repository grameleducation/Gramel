"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface AppErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function AppErrorState({
  title = "Something went wrong",
  description = "We couldn't render this page right now. Please try again or return to the homepage.",
  onRetry,
  retryLabel = "Try again",
}: AppErrorStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-[#F4F7FF] to-[#E8EEFF] px-6 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-primary/10 bg-white/95 p-8 text-center shadow-xl shadow-primary/10 backdrop-blur sm:p-10">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="size-8" />
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-neutral-600 sm:text-base">
          {description}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {true ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-300"
            >
              <RefreshCcw className="size-4" />
              {retryLabel}
            </button>
          ) : null}

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-primary px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
