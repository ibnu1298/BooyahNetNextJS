"use client";

import GreetingCard from "./GreetingCard";
import ProfileView from "./ProfileView";
import { useDashboard } from "@/app/context/DashboardContext";
import TabelUserPayment from "../Table/TableUserPayment";
import { useEffect, useState } from "react";
import { getUsers } from "@/utils/Fetch/getUsers";
import { signOut, useSession } from "next-auth/react";
import { ListUser } from "@/types/UserDetail";
import TabelPembayaran from "../Table/TablePembayaran";
import { decodedToken } from "@/app/interface/decodedToken";
import { jwtDecode } from "jwt-decode";
// import SettingsView from './SettingsView'; (nanti)

export default function MainDashboard() {
  const dashboard = useDashboard();
  const { data: session } = useSession();
  const [data, setData] = useState<ListUser[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  if (!dashboard) {
    return null; // atau tampilkan loading, error, dll
  }

  const { currentView } = dashboard;

  const token = session?.user?.token;
  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode<decodedToken>(session?.user?.token as string);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        console.warn("🔴 Token expired, signing out...");
        signOut({ callbackUrl: "/session-expired" }); // opsional bikin halaman khusus
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
      signOut({ callbackUrl: "/login" });
    }

    getUsers(token).then((result) => {
      setData(result);
    });
  }, [session, userId]);
  return (
    <section className="flex-1 p-6 overflow-y-auto space-y-6">
      {currentView === "dashboard" && (
        <>
          <GreetingCard />
          {/* <SalesChart />
          <StatCards /> */}
          <TabelUserPayment
            data={data}
            onSelectUser={setUserId}
            user_id={userId!}
          />
          <TabelPembayaran
            token={session?.user?.token!}
            user_id={userId!}
            onUpdated={() => {
              if (!session?.user?.token) return;
              getUsers(session.user.token).then((result) => {
                setData(result);
              });
            }}
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
