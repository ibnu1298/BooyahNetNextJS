"use client";

import Image from "next/image";
import {
  BadgeCheck,
  BadgeX,
  CircleUserRound,
  KeyRound,
  LogOut,
  Pencil,
} from "lucide-react";
import { UserDetail } from "@/types/UserDetail";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { getUserDetail } from "@/utils/Fetch/getUserDetail";
import { capitalizeName, formatPhone } from "@/utils/commonFunctions";
import ChangePasswordSection from "../Settings/ChangePasswordSection";
import Button from "../../Elements/Button";
import Input from "../../Elements/Input";
import NotificationModal from "../Modal/NotificationModal";
import ProfileUser from "./ProfileUser";

export default function ProfileView() {
  const [user, setUser] = useState<UserDetail | null>(null);
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
              <CircleUserRound size={64} />
            )}
            <div>
              <h3 className="text-xl font-semibold">
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

      <div className="max-w-3xl mx-auto">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 rounded-2xl shadow-lg flex items-center justify-center gap-2 
               font-semibold px-6 py-3 hover:bg-red-800 active:bg-red-900 transition text-white cursor-pointer"
        >
          <LogOut size={20} strokeWidth={3} /> Logout
        </button>
      </div>
    </div>
  );
}
