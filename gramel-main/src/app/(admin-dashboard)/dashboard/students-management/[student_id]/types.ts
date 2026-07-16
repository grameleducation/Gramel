import { Nullable } from "@/lib/types";
import { Database } from "@/utils/supabase/types";

type Institution = {
  name: string;
  attended_from: string;
  attended_to: string;
  graduation_date: string;
  country: string;
  city: string;
};

export type StudentDataJSONPart = {
  next_of_kin: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  higher_institutions: Institution[];
  secondary_schools: Institution[];
  other_education: Institution[];
  assigned_staff?: Nullable<{
    id: string;
    first_name: Nullable<string>;
    last_name: Nullable<string>;
    middle_name: Nullable<string>;
  }>;
};

export type StudentData = Pick<
  Database["public"]["Tables"]["users"]["Row"],
  | "id"
  | "first_name"
  | "last_name"
  | "middle_name"
  | "email"
  | "date_of_birth"
  | "passport_no"
  | "passport_expiry_date"
  | "gender"
  | "marital_status"
  | "address"
  | "phone"
  | "profile_picture_url"
  | "highest_education"
  | "highest_edu_country"
  | "highest_edu_grading_scale"
  | "highest_edu_grade_average"
> &
  StudentDataJSONPart;

export type PaymentTransaction =
  Database["public"]["Tables"]["payment_transactions"]["Row"];
