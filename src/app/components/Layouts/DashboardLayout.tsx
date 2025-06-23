"use client";

import { DashboardProvider } from "@/app/context/DashboardContext";
import MainDashboard from "../Fragments/Dashboard/MainDashboard";
import RightPanel from "../Fragments/Dashboard/RightPanel";
import Sidebar from "../Fragments/Dashboard/Sidebar";

export default function DasboardLayout() {
  return (
    <DashboardProvider>
      <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex">
          <MainDashboard />
          <RightPanel />
        </main>
      </div>
    </DashboardProvider>
  );
}
