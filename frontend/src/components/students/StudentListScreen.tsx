"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import AppDataTable from "@/components/common/AppDataTable";
import PageHeading from "@/components/common/PageHeading";
import StateBlock from "@/components/common/StateBlock";
import StudentFilters from "@/components/students/StudentFilters";
import StudentNameCell from "@/components/students/StudentNameCell";
import StudentStatusTag from "@/components/students/StudentStatusTag";
import { MOCK_STUDENTS } from "@/mocks/students";
import type { Student, StudentListFilters } from "@/types/student";
import { formatDate, formatRupees } from "@/utils/format";

const ROWS_PER_PAGE = 10;
const EMPTY_FILTERS: StudentListFilters = { search: "", course: null, status: null };

/**
 * HW1 demo switch: ?state=loading | empty | error shows that state with mock data.
 * Anything else (or nothing) shows the filled list. HW2 replaces this with the API hook.
 */
type DemoState = "loading" | "empty" | "error" | "filled";

function readDemoState(value: string | null): DemoState {
  return value === "loading" || value === "empty" || value === "error" ? value : "filled";
}

// Student list page: heading, filters, table with loading / empty / error / filled states.
export default function StudentListScreen() {
  const router = useRouter();
  const demoState = readDemoState(useSearchParams().get("state"));

  // Screen-only state: current filters and the first row of the current page
  const [filters, setFilters] = useState<StudentListFilters>(EMPTY_FILTERS);
  const [first, setFirst] = useState(0);

  const hasFilters = filters.search.trim() !== "" || filters.course !== null || filters.status !== null;

  // Apply search + filters to the mock data (the API does this in HW2)
  const visibleStudents = useMemo(() => {
    const allStudents = demoState === "empty" ? [] : MOCK_STUDENTS;
    const term = filters.search.trim().toLowerCase();
    return allStudents.filter(
      (student) =>
        (term === "" ||
          student.name.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term)) &&
        (filters.course === null || student.course === filters.course) &&
        (filters.status === null || student.status === filters.status),
    );
  }, [demoState, filters]);

  // Any filter change goes back to page 1
  const handleFilterChange = (changed: Partial<StudentListFilters>) => {
    setFilters((current) => ({ ...current, ...changed }));
    setFirst(0);
  };

  const clearFilters = () => handleFilterChange(EMPTY_FILTERS);

  // Empty state: different copy for "no data at all" vs "nothing matches the filters"
  const emptyState = hasFilters ? (
    <StateBlock
      variant="empty"
      title="No students found"
      message="No student matches your search or filters. Try a different name, or clear the filters."
      action={<Button label="Clear filters" className="secondary-button" onClick={clearFilters} />}
    />
  ) : (
    <StateBlock
      variant="empty"
      title="No students yet"
      message="Students you add will appear here."
      action={<Button label="Add student" icon="pi pi-plus" className="primary-button" />}
    />
  );

  return (
    <div className="student-list-container">
      <PageHeading
        title="Students"
        subtitle="View and manage every enrolled student."
        actions={<Button label="Add student" icon="pi pi-plus" className="primary-button" />}
      />

      <section className="student-list-card" aria-label="Student list">
        <StudentFilters filters={filters} onChange={handleFilterChange} />

        {demoState === "error" ? (
          <StateBlock
            variant="error"
            title="Could not load students"
            message="Something went wrong while loading the student list. Please try again."
            action={
              <Button
                label="Try again"
                icon="pi pi-refresh"
                className="secondary-button"
                onClick={() => router.replace("/students/list")}
              />
            }
          />
        ) : (
          <AppDataTable<Student>
            value={visibleStudents}
            dataKey="id"
            ariaLabel="Students"
            recordLabel="students"
            loading={demoState === "loading"}
            emptyState={emptyState}
            first={first}
            rows={ROWS_PER_PAGE}
            onPageChange={setFirst}
          >
            <Column
              header="Name"
              body={(student: Student) => <StudentNameCell name={student.name} email={student.email} />}
            />
            <Column header="Course" field="course" />
            <Column header="Status" body={(student: Student) => <StudentStatusTag status={student.status} />} />
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
                  <Button icon="pi pi-eye" rounded text aria-label={`View ${student.name}`} />
                  <Button icon="pi pi-pencil" rounded text aria-label={`Edit ${student.name}`} />
                  <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    className="danger-icon-button"
                    aria-label={`Delete ${student.name}`}
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
