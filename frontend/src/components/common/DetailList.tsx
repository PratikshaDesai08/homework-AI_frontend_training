import type { ReactNode } from "react";

export interface DetailItem {
  label: string;
  value: ReactNode;
  /** Grey italic text, e.g. "Not provided" */
  muted?: boolean;
}

interface DetailListProps {
  title: string;
  items: DetailItem[];
}

// Card with label / value pairs in a grid (3 columns wide, 1 column on phones).
export default function DetailList({ title, items }: DetailListProps) {
  return (
    <section className="detail-list" aria-label={title}>
      <h2 className="detail-list-title">{title}</h2>
      <dl className="detail-list-grid">
        {items.map((item) => (
          <div className="detail-list-item" key={item.label}>
            <dt className="detail-list-label">{item.label}</dt>
            <dd className={item.muted ? "detail-list-value detail-list-value-muted" : "detail-list-value"}>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
