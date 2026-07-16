import { UserRoles } from "@/lib/permissions/role";

export function isUserRole(role: string): role is UserRoles {
  return Object.values(UserRoles).includes(role as UserRoles);
}
