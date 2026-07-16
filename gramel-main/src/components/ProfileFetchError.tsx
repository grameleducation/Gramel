"use client";

import { useState } from "react";

export default function ProfileFetchError({ errorMsg }: { errorMsg?: string }) {
  const [loading, setLoading] = useState(false);

  const handleRetry = () => {
    setLoading(true);
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-red-600">
          Unable to load your profile
        </h2>
        <p className="text-neutral-600">
          {errorMsg ||
            "There was a problem fetching your profile information. Please check your internet connection or try again."}
        </p>
      </div>

      <button
        onClick={handleRetry}
        disabled={loading}
        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-300 disabled:opacity-70"
      >
        {loading && (
          <svg
            className="mr-2 h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
        )}
        {loading ? "Refreshing..." : "Retry"}
      </button>
    </div>
  );
}
