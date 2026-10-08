"use client";

import { useRouter } from "next/navigation";
import BackLink from "@/components/common/BackLink";
import PageHeading from "@/components/common/PageHeading";
import { useAppToast } from "@/components/common/ToastProvider";
import StudentForm, { EMPTY_STUDENT_FORM } from "@/components/students/StudentForm";
import { useCreateStudent } from "@/hooks/API/students/useCreateStudent";
import type { StudentPayload } from "@/types/student";

// /students/create: empty form → POST → toast → back to the list (which refetches by itself).
export default function StudentCreateScreen() {
  const router = useRouter();
  const { showToast } = useAppToast();
  const createStudent = useCreateStudent();

  const handleSubmit = async (payload: StudentPayload) => {
    const student = await createStudent.mutateAsync(payload);
    showToast("success", `${student.name} was added.`);
    router.push("/students/list");
  };

  return (
    <div className="student-form-container">
      <BackLink href="/students/list" label="Back to students" />
      <PageHeading title="Add student" subtitle="Fields marked * are required." />
      <StudentForm
        initialValues={EMPTY_STUDENT_FORM}
        submitLabel="Add student"
        cancelHref="/students/list"
        onSubmit={handleSubmit}
        submitting={createStudent.isPending}
      />
    </div>
  );
}
