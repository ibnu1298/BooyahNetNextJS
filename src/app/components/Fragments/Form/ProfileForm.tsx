"use client";

import { useEffect, useState } from "react";
import Input from "../../Elements/Input";
import Button from "../../Elements/Button";
import { getUserDetail } from "@/utils/Fetch/getUserDetail";
import { UserDetail } from "@/types/UserDetail";
import { useSession } from "next-auth/react";
import { BadgeCheck, BadgeX } from "lucide-react";

export default function ProfileForm() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [user, setUser] = useState<UserDetail | null>(null);
  const [verifyWANumber, setVerifyWANumber] = useState(false);
  console.log(`user:${user}`);
  console.log(`successMsg:${successMsg}`);
  useEffect(() => {
    getUserDetail(session?.user?.user_id!, session?.user?.token || "").then(
      (result: any) => {
        setUser(result);
        setLoading(false);
      }
    );
    setVerifyWANumber(user?.verify_phone ?? false);
  }, [user, session]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  console.log("verifyWANumber" + verifyWANumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      // Simulasi submit (ganti dengan fetch ke API update profile kamu)
      await new Promise((r) => setTimeout(r, 1000));
      setSuccessMsg("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <Input
        label="Nama Lengkap"
        name="name"
        placeholder="Masukkan nama lengkap"
        value={user?.name ?? ""}
        onChange={handleChange}
        required
      />
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="Masukkan email"
        value={user?.email ?? ""}
        onChange={handleChange}
        required
      />
      <Input
        label="Nomor Whatsapp"
        type="text"
        name="Nomor Whatsapp"
        placeholder="Masukkan Nomor Whatsapp"
        value={user?.phone ? `+${user?.phone}` : ""}
        onChange={handleChange}
        required
        rightIcon={
          verifyWANumber ? (
            <BadgeCheck
              size={20}
              strokeWidth={2.5}
              absoluteStrokeWidth
              className="text-green-300"
            />
          ) : (
            <BadgeX
              size={20}
              strokeWidth={2.5}
              absoluteStrokeWidth
              className="text-gray-400"
            />
          )
        }
        tooltipMessage={
          verifyWANumber
            ? "WhatsApp terverifikasi ✅"
            : "Belum terverifikasi ❌"
        }
      />
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Masukkan password"
        value={""}
        onChange={handleChange}
      />

      {successMsg && <div className="text-green-400 text-sm">{successMsg}</div>}

      <Button type="submit" disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
