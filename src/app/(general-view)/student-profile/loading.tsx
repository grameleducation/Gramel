"use client";

import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <LoaderCircle className="animate-spin text-primary-300" size={64} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
