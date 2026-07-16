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
