"use client";

import { useEffect, useState } from "react";
import Input from "../../Elements/Input";
import Button from "../../Elements/Button";
import NotificationModal from "./../Modal/NotificationModal";
import { useRouter } from "next/navigation";
import { BadgeCheck, BadgeX } from "lucide-react";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [verifyWANumber, setVerifyWANumber] = useState(false);
  const [email, setEmail] = useState("");
  const [showGetOTP, setShowGetOTP] = useState(false);
  const [waNumber, setWaNumber] = useState("");
  const [prefix, setPrefix] = useState("62");
  const [cooldown, setCooldown] = useState(30);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [notif, setNotif] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const wa_number = `${prefix}${waNumber}`;
  const router = useRouter();
  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => {
        setCooldown((c) => c - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldown]);

  const getOTP = async () => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/otp/unregistered-whatsapp`;
    console.log(wa_number);

    if (
      !wa_number ||
      wa_number.trim() == "" ||
      wa_number == undefined ||
      wa_number == prefix
    ) {
      setNotif({
        show: true,
        message: "Nomor Whatsappp belum diisi",
        type: "error",
      });
      return;
    }
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
      setShowGetOTP(true);
      setCooldown(30);
    }

    console.log(res.ok);
    console.log(response);
  };
  const verifyUnregisteredWA = async () => {
    if (!waNumber || !otp) {
      setNotif({
        show: true,
        message: "Nomor WhatsApp dan OTP wajib diisi",
        type: "error",
      });
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/otp/verification-unregistered`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wa_number,
            otp,
          }),
        }
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok || !data.success) {
        setNotif({
          show: true,
          message: data.message || "Verifikasi gagal",
          type: "error",
        });
        return;
      }

      const verified = data.data?.verified;
      setVerifyWANumber(verified);
      setNotif({
        show: true,
        message: "Nomor berhasil diverifikasi!",
        type: "success",
      });
    } catch (err) {
      console.error("Gagal verifikasi OTP:", err);
      setNotif({
        show: true,
        message: "Terjadi kesalahan saat verifikasi OTP",
        type: "error",
      });
    }
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/auth/register-with-whatsapp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            wa_number,
            verify_wa_number: verifyWANumber,
            otp,
          }),
        }
      );
      console.log(name, email, password, wa_number, verifyWANumber);

      const result = await res.json();
      console.log(result);

      if (!res.ok) {
        setNotif({
          show: true,
          message: result.message || "Registrasi gagal",
          type: "error",
        });
        return;
      }

      setNotif({
        show: true,
        message: "Registrasi berhasil!",
        type: "success",
      });

      // Redirect ke login setelah 1.5 detik
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      setNotif({
        show: true,
        message: "Terjadi kesalahan server. " + error,
        type: "error",
      });
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <Input
        type="text"
        placeholder="Nama lengkap"
        value={name}
        onChange={(e: any) => setName(e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e: any) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e: any) => setPassword(e.target.value)}
        required
      />
      <Input
        placeholder="Nomor Whatsapp"
        type="text"
        value={waNumber}
        onChange={(e) => {
          const newValue = e.target.value;
          setWaNumber(newValue);
          if (verifyWANumber) {
            setVerifyWANumber(false); // reset verifikasi kalau user ubah input
          }
        }}
        isPhoneNumber
        prefix={prefix}
        onPrefixChange={setPrefix}
        readOnly={verifyWANumber} // kalau sudah terverifikasi, tidak bisa diubah
        rightIcon={
          verifyWANumber ? (
            <BadgeCheck
              size={20}
              strokeWidth={2}
              absoluteStrokeWidth
              className="text-green-300"
            />
          ) : (
            <BadgeX
              size={20}
              strokeWidth={2}
              absoluteStrokeWidth
              className="text-gray-400"
            />
          )
        }
      />
      {!verifyWANumber && (
        <>
          {!showGetOTP ? (
            <Button type="button" onClick={getOTP}>
              Kirim OTP
            </Button>
          ) : (
            <>
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
              <Button type="button" onClick={verifyUnregisteredWA}>
                Verifikasi
              </Button>
            </>
          )}
        </>
      )}
      <Button type="submit" disabled={!verifyWANumber}>
        Submit
      </Button>
      <NotificationModal
        message={notif.message}
        type={notif.type}
        show={notif.show}
        onClose={() => setNotif((prev) => ({ ...prev, show: false }))}
      />
      <p className="text-white text-center text-sm mt-4">
        Sudah punya akun?{" "}
        <a href="/login" className="font-bold underline">
          Login
        </a>
      </p>
    </form>
  );
}
