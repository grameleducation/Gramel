import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";
import type { Auth } from "./auth";
import client_env from "../env.client";

export const authClient = createAuthClient({
  plugins: [customSessionClient<Auth>()],
  baseURL: client_env.NEXT_PUBLIC_BASE_URL,
});
