// app/session-expired/page.tsx
"use client";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../components/Elements/Button";

export default function SessionExpired() {
  const router = useRouter();

  useEffect(() => {
    // Logout user tapi jangan redirect langsung
    signOut({ redirect: false });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-700/50 shadow-lg rounded-lg p-9 text-center space-y-4 max-w-sm w-full">
        <h2 className="text-xl font-bold text-white">
          Sesi Anda Telah Berakhir
        </h2>
        <p className="text-gray-300 text-sm">
          Untuk alasan keamanan, Anda telah keluar secara otomatis. Silakan
          login kembali.
        </p>
        <Button onClick={() => router.push("/login")}>OK</Button>
      </div>
    </div>
  );
}
