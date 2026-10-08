interface DetailSkeletonProps {
  label: string;
  /** Number of placeholder label/value pairs */
  items?: number;
}

// Grey placeholder for a details page or a form while its data loads.
export default function DetailSkeleton({ label, items = 8 }: DetailSkeletonProps) {
  return (
    <div className="detail-skeleton" aria-busy="true" aria-live="polite">
      <div className="detail-skeleton-heading">
        <span className="skeleton detail-skeleton-avatar" />
        <div className="detail-skeleton-lines">
          <span className="skeleton detail-skeleton-title" />
          <span className="skeleton table-skeleton-line" />
        </div>
      </div>
      <div className="detail-skeleton-card">
        {Array.from({ length: items }, (_, index) => (
          <div className="detail-skeleton-item" key={index}>
            <span className="skeleton detail-skeleton-label" />
            <span className="skeleton table-skeleton-line" />
          </div>
        ))}
      </div>
      <p className="visually-hidden">{label}</p>
    </div>
  );
}
