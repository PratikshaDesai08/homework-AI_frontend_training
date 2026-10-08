"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { toApiError } from "@/api-services/http";
import FormField from "@/components/common/FormField";
import { STUDENT_COURSES, STUDENT_STATUSES, type StudentPayload } from "@/types/student";
import {
  STUDENT_RULES,
  toStudentPayload,
  todayIso,
  validateStudent,
  type StudentFormErrors,
  type StudentFormValues,
} from "@/utils/student-rules";

export const EMPTY_STUDENT_FORM: StudentFormValues = {
  name: "",
  email: "",
  phone: "",
  course: null,
  status: "Active",
  enrolledOn: null,
  feesPaid: null,
};

interface StudentFormProps {
  initialValues: StudentFormValues;
  submitLabel: string;
  cancelHref: string;
  /** Sends the payload to the API. Throw (reject) on failure; the form shows the API's message. */
  onSubmit: (payload: StudentPayload) => Promise<unknown>;
  /** True while the API call runs: the submit button is disabled so it can't be clicked twice */
  submitting: boolean;
}

const courseOptions = STUDENT_COURSES.map((course) => ({ label: course, value: course }));
const statusOptions = STUDENT_STATUSES.map((status) => ({ label: status, value: status }));

/** "2026-08-12" → local Date (the Calendar works with Date objects) */
function isoToDate(iso: string | null): Date | null {
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** local Date → "2026-08-12" */
function dateToIso(date: Date | null | undefined): string | null {
  if (!date) return null;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// Add / edit student form. Validation matches the backend DTO; API errors appear under the fields.
export default function StudentForm({ initialValues, submitLabel, cancelHref, onSubmit, submitting }: StudentFormProps) {
  const [values, setValues] = useState<StudentFormValues>(initialValues);
  const [errors, setErrors] = useState<StudentFormErrors>({});
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  // After the first submit, errors update as the user types
  const [submitted, setSubmitted] = useState(false);

  const setField = <K extends keyof StudentFormValues>(field: K, value: StudentFormValues[K]) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (submitted) setErrors(validateStudent(next));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validateStudent(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setBannerMessage("Please fix the highlighted fields.");
      document.getElementById(`student-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setBannerMessage(null);
    try {
      await onSubmit(toStudentPayload(values));
    } catch (error) {
      // Keep what the user typed; show the API's message and any field errors (e.g. duplicate email)
      const apiError = toApiError(error);
      setErrors(apiError.fieldErrors as StudentFormErrors);
      setBannerMessage(apiError.message);
    }
  };

  const describedBy = (field: keyof StudentFormValues) => `student-${field}-note`;

  return (
    <form className="student-form" onSubmit={handleSubmit} noValidate aria-label={submitLabel}>
      {/* Error banner after a failed submit */}
      {bannerMessage && <Message severity="error" text={bannerMessage} className="student-form-banner" />}

      <div className="student-form-grid">
        <FormField htmlFor="student-name" label="Full name" required help="2 to 50 letters." error={errors.name}>
          <InputText
            id="student-name"
            value={values.name}
            placeholder="e.g. Aarav Sharma"
            maxLength={STUDENT_RULES.nameMax + 10}
            invalid={!!errors.name}
            aria-describedby={describedBy("name")}
            onChange={(event) => setField("name", event.target.value)}
          />
        </FormField>

        <FormField htmlFor="student-email" label="Email" required help="Used to contact the student." error={errors.email}>
          <InputText
            id="student-email"
            type="email"
            value={values.email}
            placeholder="name@example.com"
            invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            onChange={(event) => setField("email", event.target.value)}
          />
        </FormField>

        <FormField htmlFor="student-phone" label="Phone" help="10 digits." error={errors.phone}>
          <InputText
            id="student-phone"
            type="tel"
            inputMode="numeric"
            keyfilter="int"
            value={values.phone}
            placeholder="10 digits, e.g. 9820012345"
            maxLength={STUDENT_RULES.phoneLength}
            invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
            onChange={(event) => setField("phone", event.target.value)}
          />
        </FormField>

        <FormField htmlFor="student-course" label="Course" required help="Choose one course." error={errors.course}>
          <Dropdown
            inputId="student-course"
            options={courseOptions}
            value={values.course}
            placeholder="Select a course"
            invalid={!!errors.course}
            aria-describedby={describedBy("course")}
            onChange={(event) => setField("course", event.value ?? null)}
          />
        </FormField>

        <FormField htmlFor="student-status" label="Status" required help="Active, Inactive or Graduated." error={errors.status}>
          <Dropdown
            inputId="student-status"
            options={statusOptions}
            value={values.status}
            placeholder="Select a status"
            invalid={!!errors.status}
            aria-describedby={describedBy("status")}
            onChange={(event) => setField("status", event.value ?? null)}
          />
        </FormField>

        <FormField htmlFor="student-enrolledOn" label="Enrolled on" required help="Today or earlier." error={errors.enrolledOn}>
          <Calendar
            inputId="student-enrolledOn"
            value={isoToDate(values.enrolledOn)}
            dateFormat="MM d, yy"
            placeholder="Select a date"
            maxDate={isoToDate(todayIso()) ?? undefined}
            showIcon
            invalid={!!errors.enrolledOn}
            aria-describedby={describedBy("enrolledOn")}
            onChange={(event) => setField("enrolledOn", dateToIso(event.value))}
          />
        </FormField>

        <FormField htmlFor="student-feesPaid" label="Fees paid (₹)" required help="Whole rupees, 0 to 10,000,000." error={errors.feesPaid}>
          <InputNumber
            inputId="student-feesPaid"
            value={values.feesPaid}
            placeholder="0"
            locale="en-US"
            useGrouping
            maxFractionDigits={0}
            invalid={!!errors.feesPaid}
            aria-describedby={describedBy("feesPaid")}
            onValueChange={(event) => setField("feesPaid", event.value ?? null)}
          />
        </FormField>
      </div>

      {/* Actions: Cancel goes back without saving; submit is disabled while saving */}
      <div className="student-form-actions">
        <Link href={cancelHref} className="p-button secondary-button">
          <span className="p-button-label">Cancel</span>
        </Link>
        <Button type="submit" label={submitting ? "Saving…" : submitLabel} className="primary-button" loading={submitting} disabled={submitting} />
      </div>
    </form>
  );
}
