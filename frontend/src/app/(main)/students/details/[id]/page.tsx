import type { Metadata } from "next";
import StudentDetailsScreen from "@/components/students/StudentDetailsScreen";

export const metadata: Metadata = {
  title: "Student details | Student Admin",
};

// /students/details/[id]. In Next.js 15 `params` is a Promise.
export default async function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudentDetailsScreen id={Number(id)} />;
}
