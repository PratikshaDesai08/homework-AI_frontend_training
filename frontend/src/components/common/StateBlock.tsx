import type { ReactNode } from "react";

interface StateBlockProps {
  variant: "empty" | "error";
  title: string;
  message: string;
  /** Optional button, e.g. "Clear filters" or "Try again" */
  action?: ReactNode;
}

// Centered icon + title + message, used for empty and error states of any list.
export default function StateBlock({ variant, title, message, action }: StateBlockProps) {
  const icon = variant === "error" ? "pi pi-exclamation-triangle" : "pi pi-users";

  return (
    <div
      className={`state-block state-block-${variant}`}
      role={variant === "error" ? "alert" : "status"}
    >
      <span className="state-block-icon" aria-hidden="true">
        <i className={icon} />
      </span>
      <h2 className="state-block-title">{title}</h2>
      <p className="state-block-message">{message}</p>
      {action && <div className="state-block-action">{action}</div>}
    </div>
  );
}
