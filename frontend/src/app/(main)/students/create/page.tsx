import type { Metadata } from "next";
import StudentCreateScreen from "@/components/students/StudentCreateScreen";

export const metadata: Metadata = {
  title: "Add student | Student Admin",
};

// /students/create
export default function StudentCreatePage() {
  return <StudentCreateScreen />;
}
