import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentService } from "@/api-services/StudentService";
import type { StudentPayload } from "@/types/student";
import { QUERIES } from "@/utils/api-integration";

/** PATCH /students/:id. On success every student query (lists, details) refetches. */
export function useUpdateStudent(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StudentPayload) => StudentService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERIES.students] }),
  });
}
