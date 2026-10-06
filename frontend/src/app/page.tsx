import { redirect } from "next/navigation";

// The app opens on the student list.
export default function Home() {
  redirect("/students/list");
}
