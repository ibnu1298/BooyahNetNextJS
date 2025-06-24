import MainDashboard from "./components/Fragments/Dashboard/MainDashboard";
import { DashboardProvider } from "./context/DashboardContext";
import Sidebar from "./components/Fragments/Dashboard/Sidebar";
import RightPanel from "./components/Fragments/Dashboard/RightPanel";

export default async function DashboardPage() {
  return (
    <DashboardProvider>
      <div className="bg-[url('/images/bg.jpg')] bg-cover bg-fixed flex h-screen">
        <Sidebar />
        <main className="flex-1 flex">
          <MainDashboard />
          <RightPanel />
        </main>
      </div>
    </DashboardProvider>
  );
}
