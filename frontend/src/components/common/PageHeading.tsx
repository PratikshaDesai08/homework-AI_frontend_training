import type { ReactNode } from "react";

interface PageHeadingProps {
  title: string;
  subtitle?: string;
  /** Buttons shown on the right (wrap under the title on small screens) */
  actions?: ReactNode;
}

// Page title + subtitle + action buttons. Shared by every page.
export default function PageHeading({ title, subtitle, actions }: PageHeadingProps) {
  return (
    <div className="page-heading">
      <div className="page-heading-text">
        <h1 className="page-heading-title">{title}</h1>
        {subtitle && <p className="page-heading-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-heading-actions">{actions}</div>}
    </div>
  );
}
