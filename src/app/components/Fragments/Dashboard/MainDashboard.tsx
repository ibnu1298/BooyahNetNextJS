"use client";

import { useDashboard } from "@/app/context/DashboardContext";
import GreetingCard from "./GreetingCard";
import StatCards from "./StatCards";
import ProfileView from "./ProfileView";
import TabelPembayaran from "../Table/TablePembayaran";
import { signOut, useSession } from "next-auth/react";
import TabelUserPayment from "../Table/TableUserPayment";
import { useEffect, useState } from "react";
import { ListUser } from "@/types/UserDetail";
import { jwtDecode } from "jwt-decode";
import { decodedToken } from "@/app/interface/decodedToken";
import { getUsers } from "@/utils/Fetch/getUsers";
import TableUserDetail from "../Table/TableUserDetail";
import SalesChart from "./SalesChart";
// import SettingsView from './SettingsView'; (nanti)
const tabs = [
  { key: "payment", label: "Payments" },
  { key: "settings", label: "Settings" },
  // { key: "email-otp", label: "Email" },
];
export default function MainDashboard() {
  const dashboard = useDashboard();
  const { data: session } = useSession();
  const [data, setData] = useState<ListUser[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

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
  }, [session, userId, dashboard?.currentView]);
  if (!dashboard) {
    return null; // atau tampilkan loading, error, dll
  }
  const [activeTab, setActiveTab] = useState("payment");
  const renderForm = () => {
    switch (activeTab) {
      case "payment":
        return (
          <div className="space-y-8 flex flex-col justify-center items-center">
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
          </div>
        );
      case "settings":
        return (
          <>
            <TableUserDetail />
          </>
        );
      case "email-otp":
        return <div className="text-white">Form Email OTP belum dibuat</div>; // Ganti dengan <LoginEmailOTPForm />
      default:
        return null;
    }
  };

  const { currentView } = dashboard;
  return (
    <section className="max-w-4xl mx-auto flex-1 p-6 overflow-y-auto space-y-6">
      {currentView === "dashboard" && session?.user?.role != "Admin" && (
        <>
          <GreetingCard />
          <StatCards />
          <TabelPembayaran
            token={session?.user?.token!}
            user_id={session?.user?.user_id!}
          />
        </>
      )}
      {currentView === "dashboard" && session?.user?.role == "Admin" && (
        <>
          <GreetingCard />
          <SalesChart />
        </>
      )}
      {currentView === "admin" && (
        <>
          <div className="min-h-[100px] transition-all duration-300 grid gap-6">
            {/* <GreetingCard /> */}
            <div className="flex justify-center gap-2 text-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`px-3 py-1 rounded-full ${
                    activeTab === tab.key
                      ? "bg-cyan-600  text-white"
                      : "bg-white/10 text-gray-200"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {renderForm()}
          </div>
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
