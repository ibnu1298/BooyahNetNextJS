"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { UserDetail } from "@/types/UserDetail";
import { capitalizeName, formatTanggal } from "@/utils/commonFunctions";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { getUserDetail } from "@/utils/Fetch/getUserDetail";

export default function GreetingCard() {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = session?.user?.user_id;
    const token = session?.user?.token;
    if (!userId) return;
    getUserDetail(userId, token || "").then((result: any) => {
      setUser(result);
      setLoading(false);
    });
  }, [session]);

  if (loading) return <p className="text-white">Loading...</p>;

  if (!user) return <p className="text-white">User tidak ditemukan</p>;
  return (
    <div className="bg-pink-500 rounded-2xl p-6 flex justify-between items-center text-white">
      <div>
        <h2 className="text-2xl font-bold">
          Hello {capitalizeName(user.name)}!
        </h2>
        <p className="mt-1 text-sm">
          Selamat datang di aplikasi pencatatan pembayaran{" "}
          <strong>WiFi BooyahNet</strong>. <br />
          Pastikan untuk selalu memeriksa dan menyelesaikan pembayaran tepat
          waktu agar koneksi internet tetap lancar.
        </p>
      </div>

      <div className="w-24 md:w-32">
        <img
          src="/greeting-illustration.svg"
          alt="Character working"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
