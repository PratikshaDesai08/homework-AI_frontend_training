import type { StudentStatus } from "@/types/student";

interface StudentStatusTagProps {
  status: StudentStatus;
}

// Coloured pill for a student's status. Colour comes from SCSS per status.
export default function StudentStatusTag({ status }: StudentStatusTagProps) {
  return (
    <span className={`student-status-tag student-status-tag-${status.toLowerCase()}`}>
      {status}
    </span>
  );
}
