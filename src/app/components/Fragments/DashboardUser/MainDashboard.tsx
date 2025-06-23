"use client";

import { useDashboard } from "@/app/context/DashboardContext";
import GreetingCard from "../Dashboard/GreetingCard";
import StatCards from "../Dashboard/StatCards";
import ProfileView from "../Dashboard/ProfileView";
import TabelPembayaran from "../Table/TablePembayaran";
import { useSession } from "next-auth/react";
// import SettingsView from './SettingsView'; (nanti)

export default function MainDashboard() {
  const dashboard = useDashboard();

  if (!dashboard) {
    return null; // atau tampilkan loading, error, dll
  }

  const { currentView } = dashboard;
  const { data: session } = useSession();
  return (
    <section className="max-w-3xl mx-auto flex-1 p-6 overflow-y-auto space-y-6">
      {currentView === "dashboard" && (
        <>
          <GreetingCard />
          <StatCards />
          <TabelPembayaran
            token={session?.user?.token!}
            user_id={session?.user?.user_id!}
          />
        </>
      )}

      {currentView === "profile" && <ProfileView />}

      {currentView === "settings" && (
        <div className="text-center text-white">
          Halaman Settings belum dibuat
        </div>
      )}
    </section>
  );
}
