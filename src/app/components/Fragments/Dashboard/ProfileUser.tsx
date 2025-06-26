"use client";

import { useEffect, useState } from "react";
import Input from "../../Elements/Input";
import Button from "../../Elements/Button";
import { BadgeCheck, BadgeX, Pencil } from "lucide-react";
import { UserDetail } from "@/types/UserDetail";
import { getUserDetail } from "@/utils/Fetch/getUserDetail";
import { formatPhone } from "@/utils/commonFunctions";
import NotificationModal from "../Modal/NotificationModal";
import { useSession } from "next-auth/react";
import { div } from "framer-motion/client";

export default function ProfileUser({
  user,
  setUser,
}: {
  user: UserDetail | null;
  setUser: (user: UserDetail) => void;
}) {
  const { data: session } = useSession();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prefix, setPrefix] = useState("62");
  const [showGetOTP, setShowGetOTP] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const [otp, setOtp] = useState("");
  const [initialPhone, setInitialPhone] = useState("");

  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [verifyWANumber, setVerifyWANumber] = useState(false);
  const [notif, setNotif] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const wa_number = `${prefix}${editedUser.phone}`;
  useEffect(() => {
    if (user) {
      const rawPhone = user.phone?.slice(2) || "";

      setEditedUser({
        name: user.name || "",
        email: user.email || "",
        phone: rawPhone,
        address: user.address || "",
      });
      setInitialPhone(rawPhone);
      setVerifyWANumber(user.verify_phone ?? false);
    }
  }, [user]);

  const handleSave = async () => {
    const payload = {
      user_id: user?.user_id,
      name: editedUser.name,
      email: editedUser.email,
      address: editedUser.address,
      wa_number: `${prefix}${editedUser.phone}`, // gabungkan prefix
    };
    console.log(payload);

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/users/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`, // atau session.accessToken jika kamu simpan di situ
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        setEditMode(false);
        const updatedUser = await getUserDetail(
          session?.user?.user_id!,
          session?.user?.token || ""
        );
        setUser(updatedUser);
        setNotif({
          show: true,
          message: "Data berhasil disimpan",
          type: "success",
        });
      } else {
        setNotif({
          show: true,
          message: result.message || "Gagal menyimpan data",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Update failed:", err);
      setNotif({
        show: true,
        message: "Terjadi kesalahan pada server",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
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
  };
  const verifyUnregisteredWA = async () => {
    if (!editedUser.phone || !otp) {
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
  return (
    <div className="max-w-3xl mx-auto bg-gray-800/90 p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-semibold mb-2">Profil Pengguna</h3>
      <div className=" lg:flex items-start justify-between grid gap-6">
        <div
          className={`grid grid-cols-1 ${
            !editMode ? "lg:grid-cols-2" : ""
          } gap-3`}
        >
          <div id="name">
            <div className="text-sm text-white/30 font-extralight">
              Nama Lengkap
            </div>
            {editMode ? (
              <Input
                value={editedUser.name}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, name: e.target.value })
                }
              />
            ) : (
              <div className="text-white text-lg font-extralight">
                {editedUser.name ?? "-"}
              </div>
            )}
          </div>

          <div id="email">
            <div className="text-sm text-white/30 font-extralight">Email</div>
            {editMode ? (
              <Input
                value={editedUser.email}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, email: e.target.value })
                }
              />
            ) : (
              <div className="text-white text-lg font-extralight">
                {user?.email ?? "-"}
              </div>
            )}
          </div>

          <div id="phone">
            <div className="text-sm text-white/30 font-extralight">
              Nomor Telepon
            </div>
            {editMode ? (
              <div className="grid gap-4">
                <Input
                  placeholder="Nomor Whatsapp"
                  type="text"
                  value={editedUser.phone}
                  onChange={(e) => {
                    const newPhone = e.target.value;
                    setEditedUser({ ...editedUser, phone: newPhone });
                    if (newPhone === initialPhone) {
                      setVerifyWANumber(true); // kembali ke nilai awal, dianggap verified lagi
                    } else {
                      setVerifyWANumber(false); // ubah = reset
                    }
                  }}
                  isPhoneNumber
                  prefix={prefix}
                  onPrefixChange={setPrefix}
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
                              cooldown > 0
                                ? `Kirim Ulang (${cooldown}s)`
                                : "Kirim Ulang",
                            onClick: getOTP,
                            disabled: cooldown > 0,
                          }}
                        />
                        <Button type="button" onClick={verifyUnregisteredWA}>
                          Verifikasi OTP
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="text-white text-lg font-extralight flex items-center gap-2">
                {formatPhone(user?.phone ?? "") ?? "-"}
                {verifyWANumber ? (
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
                )}
              </div>
            )}
          </div>

          <div id="alamat">
            <div className="text-sm text-white/30 font-extralight">Alamat</div>
            {editMode ? (
              <Input
                value={editedUser.address}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, address: e.target.value })
                }
              />
            ) : (
              <div className="text-white text-lg font-extralight">
                {user?.address ?? "-"}
              </div>
            )}
          </div>
        </div>

        {editMode ? (
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading || !verifyWANumber}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
            <button
              onClick={() => setEditMode(false)}
              className="rounded-full px-4 py-2 bg-red-500 hover:bg-red-600"
            >
              Batal
            </button>
          </div>
        ) : (
          <button
            className="rounded-full w-fit items-center justify-center px-4 py-2 flex gap-2 bg-cyan-600 hover:bg-cyan-700"
            onClick={() => setEditMode(true)}
          >
            <Pencil size={18} /> Edit
          </button>
        )}
      </div>

      <NotificationModal
        message={notif.message}
        type={notif.type}
        show={notif.show}
        onClose={() => setNotif((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
