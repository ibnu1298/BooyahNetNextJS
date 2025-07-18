"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Input from "../../Elements/Input";
import Button from "../../Elements/Button";
import { useRouter } from "next/navigation";
import NotificationModal from "../Modal/NotificationModal";
import { Session } from "node:inspector/promises";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();
  const [notif, setNotif] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error === "CredentialsSignin") {
      setNotif({
        show: true,
        message: "Email atau password salah",
        type: "error",
      });
      setIsLoading(false);
    } else {
      setNotif({
        show: true,
        message: "Login berhasil!",
        type: "success",
      });

      setTimeout(async () => {
        setIsLoading(false);
        router.push("/");
      }, 1500);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          //label="Email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          //label="Password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* <div className="flex items-center justify-between text-sm text-white">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-purple-500" />
            Remember me
          </label>
          <a href="#" className="hover:underline">
            Forgot password?
          </a>
        </div> */}
        {
          <Button type="submit" disabled={loading}>
            {loading ? <>Loading...</> : <>Login</>}
          </Button>
        }
      </form>
      <NotificationModal
        message={notif.message}
        type={notif.type}
        show={notif.show}
        onClose={() => setNotif((prev) => ({ ...prev, show: false }))}
      />
    </>
  );
}
