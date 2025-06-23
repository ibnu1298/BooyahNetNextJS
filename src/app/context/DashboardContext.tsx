"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type DashboardView = "dashboard" | "profile" | "settings";

interface DashboardContextType {
  currentView: DashboardView;
  setView: (view: DashboardView) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [currentView, setCurrentView] = useState<DashboardView>("dashboard");
  return (
    <DashboardContext.Provider value={{ currentView, setView: setCurrentView }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    console.log("useDashboard must be used within DashboardProvider");
    return;
  }

  return context;
};
