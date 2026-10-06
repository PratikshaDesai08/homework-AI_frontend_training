"use client";

import type { ReactNode } from "react";
import { DataTable, type DataTablePageEvent, type DataTableValue } from "primereact/datatable";
import TableSkeleton from "./TableSkeleton";

interface AppDataTableProps<T extends DataTableValue> {
  value: T[];
  dataKey: keyof T & string;
  /** Accessible name of the table, e.g. "Students" */
  ariaLabel: string;
  /** Plural word used in "Showing 1–10 of 25 <recordLabel>" */
  recordLabel: string;
  loading: boolean;
  /** Shown instead of rows when value is empty (a StateBlock) */
  emptyState: ReactNode;
  /** Index of the first row on the current page */
  first: number;
  rows: number;
  onPageChange: (first: number) => void;
  /** <Column> elements */
  children: ReactNode;
}

// Shared list table: PrimeReact DataTable + WM loading/empty states + pagination.
// The table scrolls sideways inside its own box, never the page.
export default function AppDataTable<T extends DataTableValue>({
  value,
  dataKey,
  ariaLabel,
  recordLabel,
  loading,
  emptyState,
  first,
  rows,
  onPageChange,
  children,
}: AppDataTableProps<T>) {
  // Loading: skeleton rows instead of the table
  if (loading) {
    return <TableSkeleton rows={rows} columns={5} label={`Loading ${recordLabel}…`} />;
  }

  // Shown only on screens narrower than the table (see SCSS)
  const scrollHint =
    value.length > 0 ? (
      <p className="app-data-table-scroll-hint">Swipe the table sideways to see all columns.</p>
    ) : undefined;

  return (
    <DataTable
      className="app-data-table"
      tableClassName="app-data-table-table"
      aria-label={ariaLabel}
      value={value}
      dataKey={dataKey}
      emptyMessage={emptyState}
      footer={scrollHint}
      paginator={value.length > 0}
      first={first}
      rows={rows}
      onPage={(event: DataTablePageEvent) => onPageChange(event.first)}
      paginatorTemplate="CurrentPageReport PrevPageLink PageLinks NextPageLink"
      currentPageReportTemplate={`Showing {first}–{last} of {totalRecords} ${recordLabel}`}
    >
      {children}
    </DataTable>
  );
}
