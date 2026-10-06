import { getInitials } from "@/utils/format";

interface StudentNameCellProps {
  name: string;
  email: string;
}

// First table column: initials avatar + name + email.
export default function StudentNameCell({ name, email }: StudentNameCellProps) {
  return (
    <div className="student-name-cell">
      <span className="student-name-cell-avatar" aria-hidden="true">
        {getInitials(name)}
      </span>
      <div className="student-name-cell-text">
        <span className="student-name-cell-name">{name}</span>
        <span className="student-name-cell-email" title={email}>
          {email}
        </span>
      </div>
    </div>
  );
}
