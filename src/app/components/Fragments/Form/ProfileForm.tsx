"use client";

import { useEffect, useState } from "react";
import Input from "../../Elements/Input";
import Button from "../../Elements/Button";
import { getUserDetail } from "@/utils/Fetch/getUserDetail";
import { UserDetail } from "@/types/UserDetail";
import { useSession } from "next-auth/react";

export default function ProfileForm() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [user, setUser] = useState<UserDetail | null>(null);
  console.log(`user:${user}`);
  console.log(`successMsg:${successMsg}`);
  useEffect(() => {
    getUserDetail(session?.user?.user_id!, session?.user?.token || "").then(
      (result: any) => {
        setUser(result);
        setLoading(false);
      }
    );
  }, [user]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  console.log(user);

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
        value={`+${user?.phone}` || ""}
        onChange={handleChange}
        required
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
