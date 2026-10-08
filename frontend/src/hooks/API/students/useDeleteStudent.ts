import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentService } from "@/api-services/StudentService";
import { QUERIES } from "@/utils/api-integration";

/** DELETE /students/:id. On success the lists refetch; the deleted student's details are marked stale. */
export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => StudentService.remove(id),
    onSuccess: (_data, id) => {
      // Not removeQueries: the details page may still be showing it while we navigate away
      void queryClient.invalidateQueries({ queryKey: [QUERIES.students, QUERIES.studentDetails, id], refetchType: "none" });
      return queryClient.invalidateQueries({ queryKey: [QUERIES.students, QUERIES.studentList] });
    },
  });
}
