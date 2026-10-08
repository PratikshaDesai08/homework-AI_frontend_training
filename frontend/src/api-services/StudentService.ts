import type { Student, StudentListParams, StudentListResponse, StudentPayload } from "@/types/student";
import { API_ENDPOINTS } from "@/utils/api-integration";
import { http } from "./http";

// All student API calls. Components never call these directly; they use the hooks in src/hooks/API/students.
export const StudentService = {
  async getList(params: StudentListParams): Promise<StudentListResponse> {
    const { data } = await http.get<StudentListResponse>(API_ENDPOINTS.students, { params });
    return data;
  },

  async getDetails(id: number): Promise<Student> {
    const { data } = await http.get<Student>(API_ENDPOINTS.student(id));
    return data;
  },

  async create(payload: StudentPayload): Promise<Student> {
    const { data } = await http.post<Student>(API_ENDPOINTS.students, payload);
    return data;
  },

  async update(id: number, payload: StudentPayload): Promise<Student> {
    const { data } = await http.patch<Student>(API_ENDPOINTS.student(id), payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await http.delete(API_ENDPOINTS.student(id));
  },
};
