import { UserRoles } from "./permissions/role";

export type Nullable<T> = T | null | undefined;

export interface ClientUser {
  id: string;
  first_name?: Nullable<string>;
  middle_name?: Nullable<string>;
  last_name?: Nullable<string>;
  profile_picture_url?: Nullable<string>;
  role: UserRoles;
}

// better-auth's additionalFields (role, first_name, middle_name, last_name,
// profile_picture_url) aren't reflected in the base session/user type
// returned by auth.api.getSession(), so callers intersect with this.
export interface SessionUserFields {
  role: string;
  first_name?: Nullable<string>;
  middle_name?: Nullable<string>;
  last_name?: Nullable<string>;
}
