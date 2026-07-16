"use client";

import AuthContextProvider from "./AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        {children}
        <Toaster
          richColors // makes toast more colorful
          expand // toasts don't overlap
          closeButton // toasts have a close button
          duration={8000} // toasts last 8 seconds
          icons={{ error: null, success: null, info: null, warning: null }} // turn off these icons
          toastOptions={{ classNames: { title: "text-base" } }} // toasts have a 1rem font size
        />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
