import { Database } from "@/utils/supabase/types";

export type Staff = Pick<
  Database["public"]["Tables"]["users"]["Row"],
  "id" | "first_name" | "middle_name" | "last_name" | "email" | "phone"
>;
