import { GoogleSolid } from "@/lib/icons";
import { authClient } from "@/utils/better-auth/auth-client";
import { LoaderCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OAuthButtons({
  errorMessage,
}: {
  errorMessage: string | null;
}) {
  const pathname = usePathname();
  const [isGoogleOAuthLoading, setIsGoogleOAuthLoading] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setIsGoogleOAuthLoading(false);
    }
  }, [errorMessage]);

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(15.625rem,1fr))] gap-4">
        <button
          onClick={async () => {
            setIsGoogleOAuthLoading(true);
            const result = await authClient.signIn.social({
              provider: "google",
              callbackURL: "/",
              newUserCallbackURL: "/student-profile?new_user=true",
              errorCallbackURL: `${pathname}?oauth-error=${encodeURIComponent(
                `An error occured while signing ${pathname === "/login" ? "in" : "up"} with Google`,
              )}`,
            });
            if (result.error) {
              toast.error(result.error.message);
              setIsGoogleOAuthLoading(false);
            }
          }}
          disabled={isGoogleOAuthLoading}
          type="button"
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-[0.625rem] border border-primary-300 px-7 py-4 text-[#1E1E1E] disabled:cursor-not-allowed"
        >
          {isGoogleOAuthLoading ? (
            <LoaderCircle className="animate-spin text-2xl text-primary-300" />
          ) : (
            <GoogleSolid className="text-2xl text-primary-300" />
          )}
          Google
        </button>
      </div>
    </>
  );
}
