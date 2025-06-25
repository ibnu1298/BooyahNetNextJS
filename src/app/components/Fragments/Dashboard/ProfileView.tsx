"use client";

import Image from "next/image";
import {
  BadgeCheck,
  BadgeX,
  CircleUserRound,
  KeyRound,
  Pencil,
} from "lucide-react";
import { UserDetail } from "@/types/UserDetail";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUserDetail } from "@/utils/Fetch/getUserDetail";
import { capitalizeName, formatPhone } from "@/utils/commonFunctions";

export default function ProfileView() {
  const [user, setUser] = useState<UserDetail | null>(null);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [verifyWANumber, setVerifyWANumber] = useState(false);
  useEffect(() => {
    getUserDetail(session?.user?.user_id!, session?.user?.token || "").then(
      (result: any) => {
        setUser(result);
        setLoading(false);
      }
    );
    setVerifyWANumber(user?.verify_phone ?? false);
  }, [user]);
  return (
    <div className="space-y-6">
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

      {/* Section 2: Tambahan Konten */}
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Profil Pengguna</h3>
        <div className="flex items-start justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div id="name">
              <div className="text-sm text-white/30 font-extralight">
                Nama Lengkap
              </div>
              <div className="text-white font-extralight">{user?.name}</div>
            </div>
            <div id="email">
              <div className="text-sm text-white/30 font-extralight">Email</div>
              <div className="text-white font-extralight">{user?.email}</div>
            </div>
            <div id="phone" className="flex items-center gap-4">
              <div>
                <div className="text-sm text-white/30 font-extralight">
                  Nomor Telepon
                </div>
                <div className="text-white font-extralight">
                  {formatPhone(user?.phone ?? "-")}
                </div>
              </div>
              {user?.phone ? (
                <>
                  {verifyWANumber ? (
                    <BadgeCheck
                      size={25}
                      strokeWidth={3}
                      absoluteStrokeWidth
                      className="text-green-300"
                    />
                  ) : (
                    <BadgeX
                      size={25}
                      strokeWidth={3}
                      absoluteStrokeWidth
                      className="text-gray-400"
                    />
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
            {/* Kolom tambahan */}
            <div id="alamat">
              <div className="text-sm text-white/30 font-extralight">
                Alamat
              </div>
              <div className="text-white font-extralight">
                {user?.address ?? "-"}
              </div>
            </div>
          </div>

          {/* Kanan Atas: Tombol Edit */}
          <button className="self-start flex items-center gap-2 border border-white text-white hover:bg-white/10 px-4 py-2 rounded-full transition">
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
      {/* Section 3: Tambahan Konten */}
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex gap-1">
          <KeyRound size={23} className=" " />
          <h3 className="text-lg font-semibold mb-2">Ganti Password</h3>
        </div>
      </div>
    </div>
  );
}
