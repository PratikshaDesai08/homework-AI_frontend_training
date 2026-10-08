"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { toApiError } from "@/api-services/http";
import AppDataTable from "@/components/common/AppDataTable";
import PageHeading from "@/components/common/PageHeading";
import StateBlock from "@/components/common/StateBlock";
import StudentFilters from "@/components/students/StudentFilters";
import StudentNameCell from "@/components/students/StudentNameCell";
import StudentStatusTag from "@/components/students/StudentStatusTag";
import { useGetStudentsList } from "@/hooks/API/students/useGetStudentsList";
import { useConfirmDeleteStudent } from "@/hooks/useConfirmDeleteStudent";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { STUDENTS_PER_PAGE, useStudentListParams } from "@/hooks/useStudentListParams";
import type { Student, StudentListFilters } from "@/types/student";
import { formatDate, formatRupees } from "@/utils/format";

const SEARCH_DELAY_MS = 300;

// Student list page: heading, filters, table with loading / empty / error / filled states.
export default function StudentListScreen() {
  // Filters + page come from the URL (see useStudentListParams)
  const { filters, page, update } = useStudentListParams();

  // The search box updates instantly; the URL (and the API call) follows 300 ms after typing stops
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebouncedValue(searchInput.trim(), SEARCH_DELAY_MS);
  useEffect(() => {
    // Only once typing has settled, so "Clear filters" isn't undone by an older search term
    if (debouncedSearch === searchInput.trim() && debouncedSearch !== filters.search) {
      update({ search: debouncedSearch });
    }
  }, [debouncedSearch, searchInput, filters.search, update]);

  const listQuery = useGetStudentsList({
    search: filters.search || undefined,
    course: filters.course ?? undefined,
    status: filters.status ?? undefined,
    page,
    limit: STUDENTS_PER_PAGE,
  });
  const { confirmDelete } = useConfirmDeleteStudent();

  const students = listQuery.data?.items ?? [];
  const total = listQuery.data?.total ?? 0;
  const hasFilters = filters.search !== "" || filters.course !== null || filters.status !== null;

  const handleFilterChange = (changed: Partial<StudentListFilters>) => {
    if (changed.search !== undefined) setSearchInput(changed.search);
    else update(changed);
  };

  const clearFilters = () => {
    setSearchInput("");
    update({ search: "", course: null, status: null });
  };

  const addStudentButton = (
    <Link href="/students/create" className="p-button primary-button">
      <i className="pi pi-plus" aria-hidden="true" />
      <span className="p-button-label">Add student</span>
    </Link>
  );

  // Empty state: different copy for "no data at all" vs "nothing matches the filters"
  const emptyState = hasFilters ? (
    <StateBlock
      variant="empty"
      title="No students found"
      message="No student matches your search or filters. Try a different name, or clear the filters."
      action={<Button label="Clear filters" className="secondary-button" onClick={clearFilters} />}
    />
  ) : (
    <StateBlock variant="empty" title="No students yet" message="Students you add will appear here." action={addStudentButton} />
  );

  return (
    <div className="student-list-container">
      <PageHeading title="Students" subtitle="View and manage every enrolled student." actions={addStudentButton} />

      <section className="student-list-card" aria-label="Student list">
        <StudentFilters filters={{ ...filters, search: searchInput }} onChange={handleFilterChange} />

        {listQuery.isError && !listQuery.data ? (
          <StateBlock
            variant="error"
            title="Could not load students"
            message={toApiError(listQuery.error).message}
            action={
              <Button
                label="Try again"
                icon="pi pi-refresh"
                className="secondary-button"
                loading={listQuery.isFetching}
                onClick={() => listQuery.refetch()}
              />
            }
          />
        ) : (
          <AppDataTable<Student>
            value={students}
            dataKey="id"
            totalRecords={total}
            ariaLabel="Students"
            recordLabel="students"
            loading={listQuery.isPending}
            busy={listQuery.isPlaceholderData}
            emptyState={emptyState}
            first={(page - 1) * STUDENTS_PER_PAGE}
            rows={STUDENTS_PER_PAGE}
            onPageChange={(first) => update({ ...filters, page: first / STUDENTS_PER_PAGE + 1 })}
          >
            <Column
              header="Name"
              className="app-data-table-cell-lead"
              body={(student: Student) => (
                <Link href={`/students/details/${student.id}`} className="student-list-name-link">
                  <StudentNameCell name={student.name} email={student.email} />
                </Link>
              )}
            />
            <Column header="Course" field="course" />
            <Column
              header="Status"
              className="app-data-table-cell-badge"
              body={(student: Student) => <StudentStatusTag status={student.status} />}
            />
            <Column
              header="Enrolled on"
              className="app-data-table-cell-nowrap"
              body={(student: Student) => formatDate(student.enrolledOn)}
            />
            <Column
              header="Fees paid"
              className="app-data-table-cell-number"
              headerClassName="app-data-table-cell-number"
              body={(student: Student) => formatRupees(student.feesPaid)}
            />
            <Column
              header="Actions"
              className="app-data-table-cell-actions"
              headerClassName="app-data-table-cell-actions"
              body={(student: Student) => (
                <div className="student-list-actions">
                  <Link
                    href={`/students/details/${student.id}`}
                    className="p-button p-button-icon-only p-button-rounded p-button-text"
                    aria-label={`View ${student.name}`}
                  >
                    <i className="pi pi-eye" aria-hidden="true" />
                  </Link>
                  <Link
                    href={`/students/edit/${student.id}`}
                    className="p-button p-button-icon-only p-button-rounded p-button-text"
                    aria-label={`Edit ${student.name}`}
                  >
                    <i className="pi pi-pencil" aria-hidden="true" />
                  </Link>
                  <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    className="danger-icon-button"
                    aria-label={`Delete ${student.name}`}
                    onClick={() => confirmDelete(student)}
                  />
                </div>
              )}
            />
          </AppDataTable>
        )}
      </section>
    </div>
  );
}
