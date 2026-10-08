import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  STUDENT_COURSES,
  STUDENT_STATUSES,
  type StudentCourse,
  type StudentListFilters,
  type StudentStatus,
} from "@/types/student";

export const STUDENTS_PER_PAGE = 10;

/**
 * List filters and page live in the URL (?search=&course=&status=&page=),
 * so refresh, back/forward and shared links keep them.
 */
export function useStudentListParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<StudentListFilters>(() => {
    const course = searchParams.get("course");
    const status = searchParams.get("status");
    return {
      search: searchParams.get("search") ?? "",
      course: STUDENT_COURSES.includes(course as StudentCourse) ? (course as StudentCourse) : null,
      status: STUDENT_STATUSES.includes(status as StudentStatus) ? (status as StudentStatus) : null,
    };
  }, [searchParams]);

  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  // Write new values to the URL; any filter change goes back to page 1
  const update = useCallback(
    (changes: Partial<StudentListFilters> & { page?: number }) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === "" || value === undefined || (key === "page" && value === 1)) next.delete(key);
        else next.set(key, String(value));
      }
      if (!("page" in changes)) next.delete("page");
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { filters, page, update };
}
