import { StudentData } from "../[student_id]/types";

export type Student = Pick<
  StudentData,
  | "id"
  | "assigned_staff"
  | "first_name"
  | "middle_name"
  | "last_name"
  | "email"
  | "phone"
>;
