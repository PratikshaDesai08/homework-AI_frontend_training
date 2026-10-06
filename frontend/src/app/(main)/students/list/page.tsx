import type { Metadata } from "next";
import { Suspense } from "react";
import StudentListScreen from "@/components/students/StudentListScreen";

export const metadata: Metadata = {
  title: "Students | Student Admin",
};

// /students/list. Suspense is required because the screen reads ?state= from the URL.
export default function StudentListPage() {
  return (
    <Suspense>
      <StudentListScreen />
    </Suspense>
  );
}
