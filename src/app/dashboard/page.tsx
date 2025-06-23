import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ini udah bisa
import { redirect } from "next/navigation";
import DasboardLayout from "../components/Layouts/DashboardLayout";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  if (session.user?.role !== "Admin") {
    redirect("/");
  }

  return <DasboardLayout />;
}
