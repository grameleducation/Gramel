"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function WelcomeModal({ new_user }: { new_user: boolean }) {
  const [showModal, setShowModal] = useState(new_user);

  return showModal ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 px-4 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="mb-2 text-primary" size={48} />
          <h2 className="text-2xl font-bold text-primary">
            Welcome to Gramel!
          </h2>
          <p className="text-center text-base text-neutral-700">
            Your account has been created successfully.
            <br />
            Please update your profile to get started.
          </p>
          <button
            onClick={() => {
              // Clear the query parameter and close the modal
              const url = new URL(window.location.href);
              url.searchParams.delete("new_user");
              window.history.replaceState({}, "", url.toString());
              setShowModal(false);
            }}
            className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-white duration-200 hover:bg-primary-300"
          >
            Continue to Profile
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
