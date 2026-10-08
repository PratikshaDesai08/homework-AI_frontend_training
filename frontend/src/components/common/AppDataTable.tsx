"use client";

import type { ReactNode } from "react";
import { DataTable, type DataTablePageEvent, type DataTableValue } from "primereact/datatable";
import { BREAKPOINTS } from "@/utils/breakpoints";
import TableSkeleton from "./TableSkeleton";

interface AppDataTableProps<T extends DataTableValue> {
  /** Rows of the current page (the API pages the data) */
  value: T[];
  dataKey: keyof T & string;
  /** Total rows across all pages, from the API */
  totalRecords: number;
  /** Accessible name of the table, e.g. "Students" */
  ariaLabel: string;
  /** Plural word used in "Showing 1–10 of 25 <recordLabel>" */
  recordLabel: string;
  /** First load: skeleton rows instead of the table */
  loading: boolean;
  /** Refetching (new page/filter) while the old rows stay visible */
  busy?: boolean;
  /** Shown instead of rows when value is empty (a StateBlock) */
  emptyState: ReactNode;
  /** Index of the first row on the current page */
  first: number;
  rows: number;
  onPageChange: (first: number) => void;
  /** <Column> elements */
  children: ReactNode;
}

// Shared list table: PrimeReact DataTable (server-side paging) + WM loading/empty states + pagination.
// Phones and small tablets (≤ 768px): each row becomes a card (CSS only, see _app-data-table.scss).
// Wider screens: a normal table that scrolls sideways inside its own box if needed, never the page.
export default function AppDataTable<T extends DataTableValue>({
  value,
  dataKey,
  totalRecords,
  ariaLabel,
  recordLabel,
  loading,
  busy = false,
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

  // Shown only on tablets where the table is wider than its box (see SCSS)
  const scrollHint =
    value.length > 0 ? (
      <p className="app-data-table-scroll-hint">Swipe the table sideways to see all columns.</p>
    ) : undefined;

  return (
    <DataTable
      className={busy ? "app-data-table app-data-table-busy" : "app-data-table"}
      tableClassName="app-data-table-table"
      aria-label={ariaLabel}
      aria-busy={busy}
      value={value}
      dataKey={dataKey}
      lazy
      totalRecords={totalRecords}
      // "stack" makes PrimeReact render a column-name label in every cell (used by the card layout)
      responsiveLayout="stack"
      breakpoint={BREAKPOINTS.md}
      emptyMessage={emptyState}
      footer={scrollHint}
      paginator={totalRecords > 0}
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
