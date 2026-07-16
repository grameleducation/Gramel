import { servicesDetails } from "@/app/(general-view)/services/[slug]/servicesData";
import { normalize } from "@/utils/normalize";
import { startCase } from "lodash";
import moment from "moment";
import { z } from "zod";

// Validation schema for user signup data
export const signUpSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .min(1, "Provide your first name")
      .max(30, "Maximum of 30 characters")
      .transform((val) => startCase(val)),
    last_name: z
      .string()
      .trim()
      .min(1, "Provide your last name")
      .max(30, "Maximum of 30 characters")
      .transform((val) => startCase(val)),
    email: z
      .string()
      .email("Invalid email address")
      .transform((val) => val.toLowerCase()), // transform email to lowercase
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"], // Show error on confirm_password field
  });

// Schema for validating login form data
export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .transform((val) => val.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});

// Schema for validating forgot password form data
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .transform((val) => val.toLowerCase()),
});

// Schema for validating update password form data
export const updatePasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

const nullishStringToEmpty = () =>
  z
    .string()
    .nullish()
    .transform((val) => val ?? "");

const nullishEmailToEmpty = (message = "Invalid email address") =>
  z
    .string()
    .email(message)
    .nullish()
    .transform((val) => val ?? "");

const nullishStringOrDate = () => nullishStringToEmpty().or(z.date());

// Schema for reading from database (allows empty strings for new users)
export const profileReadSchema = z.object({
  first_name: nullishStringToEmpty(),
  middle_name: nullishStringToEmpty(),
  last_name: nullishStringToEmpty(),
  date_of_birth: nullishStringOrDate(),
  passport_no: nullishStringToEmpty(),
  passport_expiry_date: nullishStringOrDate(),
  gender: nullishStringToEmpty(),
  marital_status: nullishStringToEmpty(),
  address: nullishStringToEmpty(),
  phone: nullishStringToEmpty(),
  email: z.string().email("Invalid email address"),
  highest_education: nullishStringToEmpty(),
  highest_edu_country: nullishStringToEmpty(),
  highest_edu_grading_scale: nullishStringToEmpty(),
  highest_edu_grade_average: nullishStringToEmpty(),
  next_of_kin: z.object({
    name: nullishStringToEmpty(),
    address: nullishStringToEmpty(),
    phone: nullishStringToEmpty(),
    email: nullishEmailToEmpty("Invalid email address for next of kin."),
  }),
  higher_institutions: z.array(
    z.object({
      name: z.string(),
      attended_from: z.string(),
      attended_to: z.string(),
      graduation_date: z.string().or(z.date()),
      country: z.string(),
      city: z.string(),
    }),
  ),
  secondary_schools: z.array(
    z.object({
      name: z.string(),
      attended_from: z.string(),
      attended_to: z.string(),
      graduation_date: z.string().or(z.date()),
      country: z.string(),
      city: z.string(),
    }),
  ),
  other_education: z.array(
    z.object({
      name: z.string(),
      attended_from: z.string(),
      attended_to: z.string(),
      graduation_date: z.string().or(z.date()),
      country: z.string(),
      city: z.string(),
    }),
  ),
});

// Zod schema for Profile Info
export const nextOfKinSchema = z.object({
  name: z.string().trim().min(1, "Next of kin name is required"),
  address: z.string().trim().min(1, "Next of kin address is required"),
  phone: z.string().trim().min(1, "Next of kin phone number is required"),
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Next of kin email is required"),
});

export const higherInstitutionSchema = z
  .object({
    name: z.string().trim().min(1, "Institution name is required"),
    attended_from: z
      .string()
      .trim()
      .min(1, "Please select when you started attending"),
    attended_to: z
      .string()
      .trim()
      .min(1, "Please select when you finished attending"),
    graduation_date: z
      .string()
      .trim()
      .min(1, "Please select your graduation date")
      .or(z.date()),
    country: z.string().trim().min(1, "Please select the country"),
    city: z.string().trim().min(1, "Please select the city"),
  })
  .refine(
    (data) => new Date(data.attended_to) >= new Date(data.attended_from),
    {
      message: "End date must be after  start date",
      path: ["attended_to"],
    },
  )
  .refine(
    (data) => new Date(data.graduation_date) >= new Date(data.attended_from),
    {
      message: "Graduation date must be after start date",
      path: ["graduation_date"],
    },
  );

export const secondarySchoolSchema = z
  .object({
    name: z.string().trim().min(1, "School name is required"),
    attended_from: z
      .string()
      .trim()
      .min(1, "Please select when you started attending"),
    attended_to: z
      .string()
      .trim()
      .min(1, "Please select when you finished attending"),
    graduation_date: z
      .string()
      .trim()
      .min(1, "Please select your graduation date")
      .or(z.date()),
    country: z.string().trim().min(1, "Please select the country"),
    city: z.string().trim().min(1, "Please select the city"),
  })
  .refine(
    (data) => new Date(data.attended_to) >= new Date(data.attended_from),
    {
      message: "End date must be after start date",
      path: ["attended_to"],
    },
  )
  .refine(
    (data) => new Date(data.graduation_date) >= new Date(data.attended_from),
    {
      message: "Graduation date must be after start date",
      path: ["graduation_date"],
    },
  );

export const otherEducationSchema = z
  .object({
    name: z.string().trim().min(1, "Education program name is required"),
    attended_from: z
      .string()
      .trim()
      .min(1, "Please select when you started attending"),
    attended_to: z
      .string()
      .trim()
      .min(1, "Please select when you finished attending"),
    graduation_date: z
      .string()
      .trim()
      .min(1, "Please select your graduation date")
      .or(z.date()),
    country: z.string().trim().min(1, "Please select the country"),
    city: z.string().trim().min(1, "Please select the city"),
  })
  .refine(
    (data) => new Date(data.attended_to) >= new Date(data.attended_from),
    {
      message: "End date must be after start date",
      path: ["attended_to"],
    },
  )
  .refine(
    (data) => new Date(data.graduation_date) >= new Date(data.attended_from),
    {
      message: "Graduation date must be after start date",
      path: ["graduation_date"],
    },
  );

// Schema for form validation
export const profileSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(30, "Maximum of 30 characters")
      .transform((val) => startCase(val)),
    middle_name: z
      .string()
      .trim()
      .max(30, "Maximum of 30 characters")
      .transform((val) => (val ? startCase(val) : "")),
    last_name: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(30, "Maximum of 30 characters")
      .transform((val) => startCase(val)),
    date_of_birth: z
      .string()
      .trim()
      .min(1, "Please select your date of birth")
      .or(z.date())
      .refine(
        (date) =>
          moment(date)
            .startOf("day")
            .isSameOrBefore(moment().startOf("day"), "day"),
        "Date of birth cannot be in the future",
      ),
    passport_no: z.string().trim().optional(),
    passport_expiry_date: z
      .string()
      .trim()
      .or(z.date())
      .nullable()
      .transform((val) => (!val ? null : val)), // turn empty string to null to avoid database error
    gender: z.string().trim().min(1, "Please select your gender"),
    marital_status: z
      .string()
      .trim()
      .min(1, "Please select your marital status"),
    address: z.string().trim().min(1, "Address is required"),
    phone: z.string().trim().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address").optional(),
    highest_education: z.string().trim().optional(),
    highest_edu_country: z.string().trim().optional(),
    highest_edu_grading_scale: z.string().trim().optional(),
    highest_edu_grade_average: z.string().trim().optional(),
    next_of_kin: nextOfKinSchema,
    higher_institutions: z.array(higherInstitutionSchema),
    secondary_schools: z.array(secondarySchoolSchema),
    other_education: z.array(otherEducationSchema),
  })
  .superRefine((data, ctx) => {
    // Ensure grade average is not greater than grade scale
    if (!data.highest_education?.trim()) return;

    const gradingScale = data.highest_edu_grading_scale;
    const gradeAverage = data.highest_edu_grade_average;

    if (!gradingScale || !gradeAverage) return;

    if (gradeAverage && !gradingScale) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide the grading scale when entering a grade average.",
        path: ["highest_edu_grading_scale"],
      });
    }

    function parseNumericGrade(grade?: string) {
      if (!grade?.trim()) return null;

      const numericGrade = Number(normalize(grade).replace("%", ""));
      return Number.isFinite(numericGrade) ? numericGrade : null;
    }

    const parsedScale = parseNumericGrade(gradingScale);

    if (parsedScale === null) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Grading scale can be 5.0, 4.0, a valid numeric scale, or 100%.",
        path: ["highest_edu_grading_scale"],
      });
    }

    const parsedAverage = parseNumericGrade(gradeAverage);
    if (parsedAverage === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Grade average must be a valid number when using a numeric grading scale.",
        path: ["highest_edu_grade_average"],
      });
      return;
    }

    if (parsedAverage > parsedScale) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Grade average cannot be higher than the grading scale.",
        path: ["highest_edu_grade_average"],
      });
    }
  });

export type ProfileFormData = z.infer<typeof profileSchema>;

export const adminProfileReadSchema = z.object({
  first_name: nullishStringToEmpty(),
  middle_name: nullishStringToEmpty(),
  last_name: nullishStringToEmpty(),
  email: z.string().email("Invalid email address"),
});

export const adminProfileSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(30, "Maximum of 30 characters")
    .transform((val) => startCase(val)),
  middle_name: z
    .string()
    .trim()
    .max(30, "Maximum of 30 characters")
    .transform((val) => (val ? startCase(val) : "")),
  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(30, "Maximum of 30 characters")
    .transform((val) => startCase(val)),
  email: z
    .string()
    .email("Invalid email address")
    .transform((val) => val.toLowerCase()),
});

export type AdminProfileFormData = z.infer<typeof adminProfileSchema>;

// Schema for contact page's form validation
export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

// Schema for offline payment form validation
export const offlinePaymentSchema = z
  .object({
    serviceSlug: z
      .string({ required_error: "Select the service paid for." })
      .trim()
      .min(1, "Select the service paid for."),
    optionName: z.string().trim().optional(),
    amountNaira: z
      .number({
        coerce: true,
        message: "Please provide a valid amount in Naira",
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number",
      })
      .positive("Enter a valid amount in Naira")
      .refine((amount) => {
        const decimalPart = amount.toString().split(".")[1];
        return !decimalPart || decimalPart.length <= 2;
      }, "Amount cannot have more than 2 decimal places"),
    paidAt: z
      .string({
        required_error: "Provide the date payment was made.",
      })
      .trim()
      .refine(
        (date) => moment(date, "YYYY-MM-DD", true).isValid(),
        "Please provide a valid date in YYYY-MM-DD format",
      )
      .refine(
        (date) => moment(date).isBefore(moment(), "day"),
        "Payment date cannot be in the future",
      ),
  })
  .superRefine((data, ctx) => {
    const service = servicesDetails[data.serviceSlug];
    if (!service) return;

    const hasTests =
      service && Array.isArray(service.tests) && service.tests?.length;
    const hasApplicationOptions =
      service &&
      Array.isArray(service.applicationOptions) &&
      service.applicationOptions?.length;

    if ((hasTests || hasApplicationOptions) && !data.optionName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select the specific option paid for.",
        path: ["optionName"],
      });
    }
  });

export const searchFieldSchema = z.enum([
  "email",
  "phone",
  "id",
  "first_name",
  "middle_name",
  "last_name",
]);
