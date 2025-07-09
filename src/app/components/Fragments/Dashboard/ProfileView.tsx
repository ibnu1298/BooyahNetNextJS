"use client";

import Image from "next/image";
import {
  BadgeCheck,
  BadgeX,
  CircleUserRound,
  KeyRound,
  LogOut,
  Pencil,
  Undo2,
} from "lucide-react";
import { UserDetail } from "@/types/UserDetail";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { getUserDetail } from "@/utils/Fetch/getUserDetail";
import { capitalizeName } from "@/utils/commonFunctions";
import ChangePasswordSection from "../Settings/ChangePasswordSection";
import ProfileUser from "./ProfileUser";
import { div } from "framer-motion/client";

export default function ProfileView() {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [wannaLogout, setWannaLogout] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.user_id && session?.user?.token) {
      getUserDetail(session.user.user_id, session.user.token).then(
        (result: UserDetail) => {
          setUser(result);
        }
      );
    }
  }, [session]);
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };
  return (
    <div className="space-y-6 ">
      {/* Section 1: Profile Header */}
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          {/* Kiri: Foto + Info */}
          <div className="flex items-center gap-4">
            {user?.photoUrl ? (
              <Image
                src={user?.photoUrl}
                alt="Foto Profil"
                width={64}
                height={64}
                className="rounded-full border border-white"
              />
            ) : (
              <CircleUserRound size={64} className="text-white" />
            )}
            <div>
              <h3 className="text-xl font-semibold text-white">
                {capitalizeName(user?.name ?? "")}
              </h3>
              <p className="text-sm font-thin  text-white/80">
                {session?.user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Profil Pengguna */}
      <ProfileUser user={user} setUser={setUser} />
      {/* Section 3: Tambahan Konten */}
      <ChangePasswordSection />

      <div className="max-w-3xl mx-auto mb-15 bg-gray-800/90 p-7 rounded-3xl">
        {wannaLogout ? (
          <div className="grid space-y-3 text-center">
            <div className="font-bold text-xl text-white">Logout</div>
            <div className="grid space-y-0  md:flex gap-5">
              <button
                onClick={() => setWannaLogout(false)}
                className="w-full bg-cyan-500 rounded-2xl shadow-lg flex items-center justify-center gap-2 
              font-semibold px-6 py-3 hover:bg-cyan-700 active:bg-cyan-700 transition text-white cursor-pointer"
              >
                <Undo2 size={20} strokeWidth={3} /> Tidak
              </button>
              <button
                onClick={handleLogout}
                className="md:w-3xs bg-red-600 rounded-2xl shadow-lg flex items-center justify-center gap-2 
              font-semibold px-6 py-3 hover:bg-red-800 active:bg-red-900 transition text-white cursor-pointer"
              >
                <LogOut size={20} strokeWidth={3} /> Ya
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setWannaLogout(true)}
            className="w-full  bg-red-600 rounded-2xl shadow-lg flex items-center justify-center gap-2 
          font-semibold px-6 py-3 hover:bg-red-800 active:bg-red-900 transition text-white cursor-pointer"
          >
            <LogOut size={20} strokeWidth={3} /> Logout
          </button>
        )}
      </div>
    </div>
  );
}
