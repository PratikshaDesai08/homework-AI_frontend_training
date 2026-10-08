"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { toApiError } from "@/api-services/http";
import BackLink from "@/components/common/BackLink";
import DetailList from "@/components/common/DetailList";
import DetailSkeleton from "@/components/common/DetailSkeleton";
import StateBlock from "@/components/common/StateBlock";
import StudentStatusTag from "@/components/students/StudentStatusTag";
import { useGetStudentDetails } from "@/hooks/API/students/useGetStudentDetails";
import { useConfirmDeleteStudent } from "@/hooks/useConfirmDeleteStudent";
import { formatDate, formatRupees, getInitials } from "@/utils/format";

interface StudentDetailsScreenProps {
  id: number;
}

// /students/details/[id]: one student's details, with Edit and Delete.
export default function StudentDetailsScreen({ id }: StudentDetailsScreenProps) {
  const router = useRouter();
  const studentQuery = useGetStudentDetails(id);
  const { confirmDelete, isDeleting } = useConfirmDeleteStudent(() => router.push("/students/list"));

  if (studentQuery.isPending && studentQuery.fetchStatus !== "idle") {
    return (
      <div className="student-details-container">
        <BackLink href="/students/list" label="Back to students" />
        <DetailSkeleton label="Loading student…" />
      </div>
    );
  }

  if (studentQuery.isError || !studentQuery.data) {
    const apiError = toApiError(studentQuery.error);
    const notFound = apiError.status === 404 || !Number.isInteger(id);
    return (
      <div className="student-details-container">
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
    <div className="student-details-container">
      <BackLink href="/students/list" label="Back to students" />

      {/* Heading: avatar + name + status, actions on the right (wrap under on small screens) */}
      <div className="student-details-heading">
        <div className="student-details-identity">
          <span className="student-details-avatar" aria-hidden="true">
            {getInitials(student.name)}
          </span>
          <div className="student-details-text">
            <div className="student-details-title-row">
              <h1 className="student-details-title">{student.name}</h1>
              <StudentStatusTag status={student.status} />
            </div>
            <span className="student-details-email">{student.email}</span>
          </div>
        </div>
        <div className="student-details-actions">
          <Link href={`/students/edit/${student.id}`} className="p-button secondary-button">
            <i className="pi pi-pencil" aria-hidden="true" />
            <span className="p-button-label">Edit</span>
          </Link>
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="danger-outline-button"
            loading={isDeleting}
            onClick={() => confirmDelete(student)}
          />
        </div>
      </div>

      <DetailList
        title="Student details"
        items={[
          { label: "Full name", value: student.name },
          { label: "Email", value: student.email },
          { label: "Phone", value: student.phone ?? "Not provided", muted: !student.phone },
          { label: "Course", value: student.course },
          { label: "Status", value: student.status },
          { label: "Enrolled on", value: formatDate(student.enrolledOn) },
          { label: "Fees paid", value: formatRupees(student.feesPaid) },
          { label: "Added on", value: formatDate(student.createdAt.slice(0, 10)) },
          { label: "Last updated", value: formatDate(student.updatedAt.slice(0, 10)) },
        ]}
      />
    </div>
  );
}
