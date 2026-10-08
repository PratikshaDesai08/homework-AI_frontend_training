// Student entity and API shapes. Field names match the backend (backend/src/students).

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

/** One student as the API returns it (GET /students/:id, items of GET /students) */
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
  /** ISO date-time */
  createdAt: string;
  /** ISO date-time */
  updatedAt: string;
}

/** Body of POST /students and PATCH /students/:id */
export type StudentPayload = Pick<Student, "name" | "email" | "phone" | "course" | "status" | "enrolledOn" | "feesPaid">;

/** GET /students response */
export interface StudentListResponse {
  items: Student[];
  total: number;
  page: number;
  limit: number;
}

/** Query string of GET /students */
export interface StudentListParams {
  search?: string;
  course?: StudentCourse;
  status?: StudentStatus;
  page: number;
  limit: number;
}

/** Filters the user controls on the list screen */
export interface StudentListFilters {
  search: string;
  course: StudentCourse | null;
  status: StudentStatus | null;
}
