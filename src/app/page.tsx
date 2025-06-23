import { authOptions } from "@/lib/auth";
import MainDashboard from "./components/Fragments/DashboardUser/MainDashboard";
import { DashboardProvider } from "./context/DashboardContext";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "./components/Fragments/Navbar";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  return (
    <DashboardProvider>
      <div className="bg-[url('/images/bg.jpg')] bg-cover bg-fixed min-h-screen">
        <Navbar />
        <main className="flex-1 flex pt-16">
          <MainDashboard />
        </main>
      </div>
    </DashboardProvider>
  );
}
