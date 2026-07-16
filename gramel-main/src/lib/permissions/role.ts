export enum UserRoles {
  student = "student",
  staff = "staff",
  admin = "admin",
}

export enum UserActions {
  view_student_profile = "view_student_profile",
  view_admin_dashboard = "view_admin_dashboard",
  update_own_profile = "update_own_profile",
  view_admin_student_management = "view_admin_student_management",
  view_admin_staff_management = "view_admin_staff_management",
  view_student_profile_as_admin = "view_student_profile_as_admin",
  vew_all_students = "view_all_students",
  update_services_price = "update_services_price",
}

export const PermisionsMap: Record<UserActions, UserRoles[]> = {
  view_student_profile: [UserRoles.student],
  update_own_profile: [UserRoles.student, UserRoles.staff, UserRoles.admin],
  view_admin_dashboard: [UserRoles.admin, UserRoles.staff],
  view_admin_student_management: [UserRoles.admin, UserRoles.staff],
  view_admin_staff_management: [UserRoles.admin],
  view_student_profile_as_admin: [UserRoles.admin, UserRoles.staff],
  view_all_students: [UserRoles.admin],
  update_services_price: [UserRoles.admin],
};
