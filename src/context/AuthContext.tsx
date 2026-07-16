"use client";

import { ClientUser } from "@/lib/types";
import { authClient } from "@/utils/better-auth/auth-client";
import { isUserRole } from "@/utils/isUserRoles";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface AuthContextType {
  user: ClientUser | null;
  isUserLoading: boolean;
  isLoggingOut: boolean;
  loadUser: (options?: { disableCookieCache?: boolean }) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<ClientUser | null>>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function loadUser({
    disableCookieCache = false,
  }: { disableCookieCache?: boolean } = {}) {
    try {
      const session = await authClient.getSession({
        query: { disableCookieCache },
      });

      if (session.error) {
        toast.error(
          session.error.message ||
            "Error loading user. Please refresh the page",
        );
        return void setUser(null);
      }

      // if data is null i.e user not logged in
      if (!session.data || !session.data.user) return setUser(null);

      if (!isUserRole(session.data.user.role)) {
        toast.error("Invalid user role. Please contact support.");
        return void setUser(null);
      }

      setUser({ ...session.data.user, role: session.data.user.role });
    } catch {
      toast.error("Error loading user. Please refresh the page");
      setUser(null);
    } finally {
      setIsUserLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onError: () => {
            toast.error(
              "Logging out failed. Please check your internet connection",
            );
          },
          onSuccess: () => {
            setUser(null);
            toast.success("Logging out successful", { duration: 3000 });
            window.location.reload();
          },
        },
      });
    } catch {
      toast.error("Logging out failed. Please check your internet connection");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <AuthContext
      value={{
        user,
        isUserLoading,
        isLoggingOut,
        setUser,
        loadUser,
        handleLogout,
      }}
    >
      {children}
    </AuthContext>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider",
    );

  return context;
}
