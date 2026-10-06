interface TableSkeletonProps {
  /** Number of placeholder rows */
  rows: number;
  /** Number of placeholder columns after the first (avatar) column */
  columns: number;
  label: string;
}

// Grey placeholder rows shown while list data is loading.
export default function TableSkeleton({ rows, columns, label }: TableSkeletonProps) {
  return (
    <div className="table-skeleton" aria-busy="true" aria-live="polite">
      <div className="table-skeleton-head" />
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div className="table-skeleton-row" key={rowIndex}>
          {/* First column: avatar + two text lines */}
          <div className="table-skeleton-lead">
            <span className="skeleton table-skeleton-avatar" />
            <div className="table-skeleton-lines">
              <span className="skeleton table-skeleton-line table-skeleton-line-wide" />
              <span className="skeleton table-skeleton-line" />
            </div>
          </div>
          {Array.from({ length: columns }, (_, colIndex) => (
            <span className="skeleton table-skeleton-line" key={colIndex} />
          ))}
        </div>
      ))}
      <p className="table-skeleton-label">{label}</p>
    </div>
  );
}
