import { PermisionsMap, UserActions, UserRoles } from "@/lib/permissions/role";
import { Nullable } from "@/lib/types";
import { ReactNode } from "react";

type Props = {
  role: Nullable<UserRoles>;
  action: UserActions;
  children: ReactNode;
  fallback?: ReactNode;
};

export function RequirePermission({
  role,
  action,
  children,
  fallback = null,
}: Props) {
  if (!role || !Object.values(UserRoles).includes(role)) return fallback;

  return PermisionsMap[action].includes(role) ? children : fallback;
}
