"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Input from "../../Elements/Input";
import Button from "../../Elements/Button";
import { validatePassword } from "@/utils/commonFunctions";

export default function ChangePasswordByOldPasswordForm() {
  const { data: session } = useSession();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCopy, setNewPasswordCopy] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [newPasswordCopyMessage, setNewPasswordCopyMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSucces] = useState(false);

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);

    const errors = validatePassword(value);
    setPasswordErrors(errors);
  };
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/auth/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session?.user?.email,
            oldPassword,
            newPassword,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        setMessage(result.message || "Gagal mengganti password.");
      } else {
        setSucces(result.success);
        setMessage("✅ " + result.message);
        setOldPassword("");
        setNewPassword("");
        setNewPasswordCopy("");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (newPasswordCopy.length > 0 && newPasswordCopy !== newPassword) {
      setNewPasswordCopyMessage("Password Baru tidak sama");
    } else {
      setNewPasswordCopyMessage("");
    }
  }, [newPassword, newPasswordCopy]);

  return (
    <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
      <Input
        placeholder="Password Baru"
        type="password"
        value={newPassword}
        onChange={handleNewPasswordChange}
        required
        className="w-full px-4 py-2 rounded bg-gray-700 text-white"
      />
      {passwordErrors.length > 0 && (
        <ul className="text-sm text-red-500 mt-2 space-y-1 ml-1">
          {passwordErrors.map((err, i) => (
            <li key={i}>• {err}</li>
          ))}
        </ul>
      )}
      <Input
        placeholder="Tulis Ulang Password Baru"
        type="password"
        value={newPasswordCopy}
        onChange={(e) => setNewPasswordCopy(e.target.value)}
        required
        disabled={newPassword === ""}
      />
      <div className="min-h-[10px] text-red-600 font-extralight text-[15px]">
        {newPasswordCopyMessage}
      </div>
      {newPasswordCopyMessage == "" && newPasswordCopy != "" && (
        <Input
          placeholder="Password Sekarang"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
      )}
      <Button
        type="submit"
        disabled={
          loading ||
          newPasswordCopyMessage !== "" ||
          passwordErrors.length > 0 ||
          oldPassword == ""
        }
      >
        {loading ? "Menyimpan..." : "Ganti Password"}
      </Button>
      {message && (
        <p
          className={`text-sm text-center mt-2 ${
            success ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
