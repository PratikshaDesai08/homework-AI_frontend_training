import type { Metadata } from "next";
import StudentEditScreen from "@/components/students/StudentEditScreen";

export const metadata: Metadata = {
  title: "Edit student | Student Admin",
};

// /students/edit/[id]. In Next.js 15 `params` is a Promise.
export default async function StudentEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudentEditScreen id={Number(id)} />;
}
