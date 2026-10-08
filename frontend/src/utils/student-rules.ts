import type { StudentPayload } from "@/types/student";
import { STUDENT_COURSES, STUDENT_STATUSES } from "@/types/student";

/**
 * Form validation. Same rules and same messages as the backend DTO
 * (backend/src/students/dto/create-student.dto.ts), so the user sees one wording either way.
 */
export const STUDENT_RULES = {
  nameMin: 2,
  nameMax: 50,
  emailMax: 100,
  phoneLength: 10,
  feesMax: 10_000_000,
} as const;

export type StudentFormValues = {
  name: string;
  email: string;
  phone: string;
  course: StudentPayload["course"] | null;
  status: StudentPayload["status"] | null;
  enrolledOn: string | null;
  feesPaid: number | null;
};

export type StudentFormErrors = Partial<Record<keyof StudentFormValues, string>>;

const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]*$/;
// Same idea as the backend's IsEmail: something@something.tld, no spaces
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\d{10}$/;

/** Today as YYYY-MM-DD in the user's timezone */
export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function validateStudent(values: StudentFormValues): StudentFormErrors {
  const errors: StudentFormErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();

  if (!name) errors.name = "Name is required.";
  else if (name.length < STUDENT_RULES.nameMin || name.length > STUDENT_RULES.nameMax)
    errors.name = `Name must be ${STUDENT_RULES.nameMin} to ${STUDENT_RULES.nameMax} characters.`;
  else if (!NAME_PATTERN.test(name))
    errors.name = "Name can only contain letters, spaces, dots (.), apostrophes (') and hyphens (-).";

  if (!email) errors.email = "Email is required.";
  else if (email.length > STUDENT_RULES.emailMax)
    errors.email = `Email must be at most ${STUDENT_RULES.emailMax} characters.`;
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address, like name@example.com.";

  if (phone && !PHONE_PATTERN.test(phone)) errors.phone = `Phone must be exactly ${STUDENT_RULES.phoneLength} digits.`;

  if (!values.course) errors.course = "Course is required.";
  else if (!STUDENT_COURSES.includes(values.course)) errors.course = `Course must be one of: ${STUDENT_COURSES.join(", ")}.`;

  if (!values.status) errors.status = "Status is required.";
  else if (!STUDENT_STATUSES.includes(values.status)) errors.status = `Status must be one of: ${STUDENT_STATUSES.join(", ")}.`;

  if (!values.enrolledOn) errors.enrolledOn = "Enrolled on is required.";
  else if (values.enrolledOn > todayIso())
    errors.enrolledOn = "Enrolled on must be a valid date that is not in the future.";

  if (values.feesPaid === null) errors.feesPaid = "Fees paid is required.";
  else if (!Number.isInteger(values.feesPaid)) errors.feesPaid = "Fees paid must be a whole number.";
  else if (values.feesPaid < 0) errors.feesPaid = "Fees paid cannot be negative.";
  else if (values.feesPaid > STUDENT_RULES.feesMax) errors.feesPaid = "Fees paid cannot be more than 10,000,000.";

  return errors;
}

/** Form values → API body (trimmed, empty phone → null). Call only after validateStudent passes. */
export function toStudentPayload(values: StudentFormValues): StudentPayload {
  return {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim() || null,
    course: values.course as StudentPayload["course"],
    status: values.status as StudentPayload["status"],
    enrolledOn: values.enrolledOn as string,
    feesPaid: values.feesPaid as number,
  };
}
