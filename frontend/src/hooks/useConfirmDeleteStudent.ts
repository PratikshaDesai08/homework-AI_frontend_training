import { useCallback } from "react";
import { confirmDialog } from "primereact/confirmdialog";
import { toApiError } from "@/api-services/http";
import { useAppToast } from "@/components/common/ToastProvider";
import { useDeleteStudent } from "@/hooks/API/students/useDeleteStudent";
import type { Student } from "@/types/student";

/**
 * "Delete student?" dialog → DELETE → toast. Used by the list and the details page.
 * `onDeleted` runs after a successful delete (e.g. go back to the list).
 */
export function useConfirmDeleteStudent(onDeleted?: () => void) {
  const { showToast } = useAppToast();
  const deleteStudent = useDeleteStudent();
  const { mutateAsync } = deleteStudent;

  const confirmDelete = useCallback(
    (student: Pick<Student, "id" | "name">) => {
      confirmDialog({
        header: "Delete student?",
        message: `${student.name} will be removed permanently. This can't be undone.`,
        icon: "pi pi-trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClassName: "danger-button",
        rejectClassName: "secondary-button",
        defaultFocus: "reject",
        // mutateAsync, not mutate(…, { onSuccess }): per-call callbacks are skipped if the page
        // re-mounted in between (React Strict Mode does that in development), the promise always settles.
        accept: async () => {
          try {
            await mutateAsync(student.id);
            showToast("success", `${student.name} was deleted.`);
            onDeleted?.();
          } catch (error) {
            showToast("error", toApiError(error).message);
          }
        },
      });
    },
    [mutateAsync, onDeleted, showToast],
  );

  return { confirmDelete, isDeleting: deleteStudent.isPending };
}
