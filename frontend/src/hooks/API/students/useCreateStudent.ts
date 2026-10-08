import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentService } from "@/api-services/StudentService";
import type { StudentPayload } from "@/types/student";
import { QUERIES } from "@/utils/api-integration";

/** POST /students. On success every student query (lists, details) refetches. */
export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StudentPayload) => StudentService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERIES.students] }),
  });
}
