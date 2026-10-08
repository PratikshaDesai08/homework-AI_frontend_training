"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { toApiError } from "@/api-services/http";
import BackLink from "@/components/common/BackLink";
import DetailSkeleton from "@/components/common/DetailSkeleton";
import PageHeading from "@/components/common/PageHeading";
import StateBlock from "@/components/common/StateBlock";
import { useAppToast } from "@/components/common/ToastProvider";
import StudentForm from "@/components/students/StudentForm";
import { useGetStudentDetails } from "@/hooks/API/students/useGetStudentDetails";
import { useUpdateStudent } from "@/hooks/API/students/useUpdateStudent";
import type { StudentPayload } from "@/types/student";

interface StudentEditScreenProps {
  id: number;
}

// /students/edit/[id]: load the student → form filled with current values → PATCH → toast → list.
export default function StudentEditScreen({ id }: StudentEditScreenProps) {
  const router = useRouter();
  const { showToast } = useAppToast();
  const studentQuery = useGetStudentDetails(id);
  const updateStudent = useUpdateStudent(id);

  const handleSubmit = async (payload: StudentPayload) => {
    const student = await updateStudent.mutateAsync(payload);
    showToast("success", `Changes to ${student.name} were saved.`);
    router.push("/students/list");
  };

  const backHref = `/students/details/${id}`;

  if (studentQuery.isPending && studentQuery.fetchStatus !== "idle") {
    return (
      <div className="student-form-container">
        <BackLink href={backHref} label="Back to student" />
        <DetailSkeleton label="Loading student…" items={7} />
      </div>
    );
  }

  if (studentQuery.isError || !studentQuery.data) {
    const apiError = toApiError(studentQuery.error);
    const notFound = apiError.status === 404 || !Number.isInteger(id);
    return (
      <div className="student-form-container">
        <BackLink href="/students/list" label="Back to students" />
        <section className="student-list-card">
          <StateBlock
            variant="error"
            title={notFound ? "Student not found" : "Could not load student"}
            message={notFound ? "This student may have been deleted." : apiError.message}
            action={
              notFound ? (
                <Link href="/students/list" className="p-button secondary-button">
                  <span className="p-button-label">Back to students</span>
                </Link>
              ) : (
                <Button label="Try again" icon="pi pi-refresh" className="secondary-button" onClick={() => studentQuery.refetch()} />
              )
            }
          />
        </section>
      </div>
    );
  }

  const student = studentQuery.data;

  return (
    <div className="student-form-container">
      <BackLink href={backHref} label="Back to student" />
      <PageHeading title="Edit student" subtitle="Fields marked * are required." />
      <StudentForm
        // Re-create the form if a different student loads into the same page
        key={student.id}
        initialValues={{
          name: student.name,
          email: student.email,
          phone: student.phone ?? "",
          course: student.course,
          status: student.status,
          enrolledOn: student.enrolledOn,
          feesPaid: student.feesPaid,
        }}
        submitLabel="Save changes"
        cancelHref={backHref}
        onSubmit={handleSubmit}
        submitting={updateStudent.isPending}
      />
    </div>
  );
}
