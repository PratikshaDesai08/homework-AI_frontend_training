// Student entity, the same shape the HW2 API will return.

export const STUDENT_COURSES = [
  "Full Stack Web",
  "Data Science",
  "UI/UX Design",
  "Cloud & DevOps",
  "Mobile Development",
] as const;

export const STUDENT_STATUSES = ["Active", "Inactive", "Graduated"] as const;

export type StudentCourse = (typeof STUDENT_COURSES)[number];
export type StudentStatus = (typeof STUDENT_STATUSES)[number];

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  course: StudentCourse;
  status: StudentStatus;
  /** ISO date, YYYY-MM-DD */
  enrolledOn: string;
  /** Whole rupees */
  feesPaid: number;
}

export interface StudentListFilters {
  search: string;
  course: StudentCourse | null;
  status: StudentStatus | null;
}
