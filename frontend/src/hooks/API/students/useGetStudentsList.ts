import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { StudentService } from "@/api-services/StudentService";
import type { StudentListParams } from "@/types/student";
import { QUERIES } from "@/utils/api-integration";

/** Student list for the given search / filters / page. Keeps the old page on screen while the next one loads. */
export function useGetStudentsList(params: StudentListParams) {
  return useQuery({
    queryKey: [QUERIES.students, QUERIES.studentList, params],
    queryFn: () => StudentService.getList(params),
    placeholderData: keepPreviousData,
  });
}
