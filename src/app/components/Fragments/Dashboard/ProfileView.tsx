"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";
import { address } from "framer-motion/client";

export default function ProfileView() {
  let photoUrl = null;
  const user = {
    name: "Budi Santoso",
    email: "budi@example.com",
    photoUrl: photoUrl || "/man-avatar.svg",
    role: "Admin",
    phone: 828762364543,
    address: "dimana ini yaa",
    birthDate: "20 September 1999",
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Profile Header */}
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          {/* Kiri: Foto + Info */}
          <div className="flex items-center gap-4">
            <Image
              src={user.photoUrl}
              alt="Foto Profil"
              width={64}
              height={64}
              className="rounded-full border border-white"
            />
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm font-thin  text-white/80">{user.role}</p>
            </div>
          </div>

          {/* Kanan: Tombol Edit */}
          <button className="flex items-center gap-2 border border-white text-white hover:bg-white/10 px-4 py-2 rounded-full transition">
            <Pencil className="w-4 h-4" />
            Edit
          </button>
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
              <div className="text-white font-extralight">{user.name}</div>
            </div>
            <div id="email">
              <div className="text-sm text-white/30 font-extralight">Email</div>
              <div className="text-white font-extralight">{user.email}</div>
            </div>
            <div id="phone">
              <div className="text-sm text-white/30 font-extralight">
                Nomor Telepon
              </div>
              <div className="text-white font-extralight">{user.phone}</div>
            </div>
            {/* Kolom tambahan */}
            <div id="alamat">
              <div className="text-sm text-white/30 font-extralight">
                Alamat
              </div>
              <div className="text-white font-extralight">{user.address}</div>
            </div>
            <div id="ttl">
              <div className="text-sm text-white/30 font-extralight">
                Tanggal Lahir
              </div>
              <div className="text-white font-extralight">{user.birthDate}</div>
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
        <h3 className="text-lg font-semibold mb-2">Informasi Tambahan</h3>
        <p className="text-white/80">
          Silakan lengkapi informasi profil Anda di sini.
        </p>
      </div>
    </div>
  );
}
