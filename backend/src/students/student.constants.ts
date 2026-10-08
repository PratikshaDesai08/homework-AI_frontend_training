// Allowed values. The frontend uses the same lists (frontend/src/types/student.ts).
export const STUDENT_COURSES = [
  'Full Stack Web',
  'Data Science',
  'UI/UX Design',
  'Cloud & DevOps',
  'Mobile Development',
] as const;

export const STUDENT_STATUSES = ['Active', 'Inactive', 'Graduated'] as const;

export type StudentCourse = (typeof STUDENT_COURSES)[number];
export type StudentStatus = (typeof STUDENT_STATUSES)[number];

// Validation limits (mirrored exactly in the frontend form)
export const STUDENT_RULES = {
  nameMin: 2,
  nameMax: 50,
  emailMax: 100,
  phoneLength: 10,
  feesMax: 10_000_000,
} as const;

export const SORTABLE_FIELDS = ['name', 'enrolledOn', 'feesPaid', 'createdAt'] as const;
export type SortableField = (typeof SORTABLE_FIELDS)[number];
