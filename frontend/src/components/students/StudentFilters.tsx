"use client";

import { Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import {
  STUDENT_COURSES,
  STUDENT_STATUSES,
  type StudentCourse,
  type StudentListFilters,
  type StudentStatus,
} from "@/types/student";

interface StudentFiltersProps {
  filters: StudentListFilters;
  /** Called with only the field that changed */
  onChange: (changed: Partial<StudentListFilters>) => void;
}

const courseOptions = STUDENT_COURSES.map((course) => ({ label: course, value: course }));
const statusOptions = STUDENT_STATUSES.map((status) => ({ label: status, value: status }));

// Search box + course and status dropdowns above the student table.
// Controlled: the parent owns the filter values.
export default function StudentFilters({ filters, onChange }: StudentFiltersProps) {
  return (
    <div className="student-filters">
      {/* Search by name or email */}
      <div className="student-filters-search">
        <label htmlFor="student-search" className="visually-hidden">
          Search students
        </label>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            id="student-search"
            type="search"
            placeholder="Search by name or email"
            value={filters.search}
            onChange={(event) => onChange({ search: event.target.value })}
          />
        </IconField>
      </div>

      {/* Course filter */}
      <div className="student-filters-select">
        <label htmlFor="student-course" className="visually-hidden">
          Course
        </label>
        <Dropdown
          inputId="student-course"
          options={courseOptions}
          value={filters.course}
          placeholder="All courses"
          showClear
          onChange={(event) => onChange({ course: (event.value as StudentCourse | undefined) ?? null })}
        />
      </div>

      {/* Status filter */}
      <div className="student-filters-select">
        <label htmlFor="student-status" className="visually-hidden">
          Status
        </label>
        <Dropdown
          inputId="student-status"
          options={statusOptions}
          value={filters.status}
          placeholder="All statuses"
          showClear
          onChange={(event) => onChange({ status: (event.value as StudentStatus | undefined) ?? null })}
        />
      </div>
    </div>
  );
}
