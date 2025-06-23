"use client";

import { useEffect, useState } from "react";
import Input from "../../Elements/Input";
import Button from "../../Elements/Button";
import { getSession, signIn } from "next-auth/react";
import NotificationModal from "../Modal/NotificationModal";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginWhatsAppForm() {
  const [showGetOTP, setShowGetOTP] = useState(true);
  const [waNumber, setWaNumber] = useState("");
  const [cooldown, setCooldown] = useState(30);
  const [otp, setOtp] = useState("");
  const [prefix, setPrefix] = useState("62");
  const router = useRouter();

  const [notif, setNotif] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });
  let wa_number = `${prefix}${waNumber}`;

  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => {
        setCooldown((c) => c - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("wa-login", {
      wa_number: wa_number,
      otp,
      redirect: false,
    });
    console.log(`res.error${res?.error}`);

    if (res?.error) {
      setNotif({
        show: true,
        message: "Kode OTP tidak valid",
        type: "error",
      });
    } else {
      setNotif({
        show: true,
        message: "Login berhasil!",
        type: "success",
      });

      setTimeout(async () => {
        const updatedSession = await getSession();
        updatedSession?.user?.role == "Admin"
          ? router.push("/dashboard")
          : router.push("/");
      }, 1500);
    }
  };
  const getOTP = async () => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/otp/whatsapp`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wa_number }),
    });

    const response = await res.json();

    if (!res.ok) {
      setNotif({
        show: true,
        message: response.message,
        type: "error",
      });
    } else {
      setShowGetOTP(false);
      setCooldown(30);
    }

    console.log(res.ok);
    console.log(response);
  };

  return (
    <>
      {showGetOTP && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            getOTP();
          }}
          className="space-y-4"
        >
          <Input
            placeholder="Nomor WhatsApp"
            type="text"
            value={waNumber}
            onChange={(e) => setWaNumber(e.target.value)}
            isPhoneNumber
            prefix={prefix}
            onPrefixChange={setPrefix}
          />

          <Button type="submit">Get OTP</Button>
        </form>
      )}
      {!showGetOTP && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Masukkan kode OTP"
            rightButton={{
              label:
                cooldown > 0 ? `Kirim Ulang (${cooldown}s)` : "Kirim Ulang",
              onClick: getOTP,
              disabled: cooldown > 0,
            }}
          />

          <Button type="submit">Verifikasi OTP</Button>
        </form>
      )}
      <NotificationModal
        message={notif.message}
        type={notif.type}
        show={notif.show}
        onClose={() => setNotif((prev) => ({ ...prev, show: false }))}
      />
    </>
  );
}
