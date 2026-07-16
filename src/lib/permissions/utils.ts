import { PermisionsMap, UserActions, UserRoles } from "./role";

export function hasPermission(role: UserRoles, action: UserActions): boolean {
  return PermisionsMap[action]?.includes(role) ?? false;
}
