"use client";

import { DashboardView, useDashboard } from "@/app/context/DashboardContext";
import {
  Home,
  User,
  Settings,
  LayoutDashboard,
  ShieldUser,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const menu: { icon: React.ReactNode; label: string; view: DashboardView }[] = [
  {
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
    view: "dashboard",
  },
  { icon: <ShieldUser />, label: "Admin", view: "admin" },
  // { icon: <Settings size={20} />, label: "Settings", view: "settings" },
  { icon: <User size={20} />, label: "Profile", view: "profile" },
];
export default function Sidebar() {
  const dashboard = useDashboard();
  const { data: session } = useSession();
  console.log("Sidebar");

  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(session?.user?.role!);
  }, [session]);

  if (!dashboard) {
    return null; // atau tampilkan loading, error, dll
  }

  const { currentView, setView } = dashboard;
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-20 bg-gray-800 flex-col items-center py-6 space-y-6">
        <nav className="flex flex-col items-center gap-6 mt-10">
          {menu.map((item, i) => {
            if (item.view === "admin" && role !== "Admin") {
              return null; // Sembunyikan tombol admin untuk non-admin
            }
            if (item.view === "dashboard" && role === "Admin") {
              return null;
            }

            return (
              <button
                key={i}
                onClick={() => setView(item.view)}
                className={`w-10 mx-2 h-10 flex items-center justify-center rounded-lg transition-all ${
                  currentView === item.view
                    ? "bg-purple-500 text-white"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
                title={item.label}
              >
                {item.icon}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 border-t border-gray-700 flex justify-around items-center py-2 md:hidden">
        {menu.map((item, i) => {
          if (item.view === "admin" && role !== "Admin") {
            return null; // Sembunyikan tombol admin untuk non-admin
          }

          return (
            <button
              key={i}
              onClick={() => setView(item.view)}
              className={`flex flex-col items-center text-xs transition ${
                currentView === item.view
                  ? "text-purple-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
