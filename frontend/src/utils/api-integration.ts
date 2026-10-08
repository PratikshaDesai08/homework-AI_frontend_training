// API paths and TanStack Query keys, one place for the whole app.

export const API_ENDPOINTS = {
  students: "/students",
  student: (id: number) => `/students/${id}`,
} as const;

export const QUERIES = {
  students: "students",
  studentList: "students-list",
  studentDetails: "students-details",
} as const;
