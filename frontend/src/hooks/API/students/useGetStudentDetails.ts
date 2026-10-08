import { useQuery } from "@tanstack/react-query";
import { StudentService } from "@/api-services/StudentService";
import { QUERIES } from "@/utils/api-integration";

/** One student by id. Disabled until the id is a real number. */
export function useGetStudentDetails(id: number) {
  return useQuery({
    queryKey: [QUERIES.students, QUERIES.studentDetails, id],
    queryFn: () => StudentService.getDetails(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}
