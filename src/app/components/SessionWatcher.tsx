"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { decodedToken } from "@/app/interface/decodedToken";

export default function SessionWatcher() {
  const { data: session } = useSession();

  useEffect(() => {
    const interval = setInterval(() => {
      const token = session?.user?.refreshToken;
      if (!token) return;

      const decoded = jwtDecode<decodedToken>(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        console.warn("🔴 Refresh token expired, signing out...");
        signOut({ callbackUrl: "/session-expired" });
      }
    }, 25000); // cek setiap 60 detik

    return () => clearInterval(interval);
  }, [session]);

  return null;
}
