"use client";

import { UserDetail } from "@/types/UserDetail";
import {
  formatTanggal,
  nextBillingDate,
  formatTanggalBulan,
} from "@/utils/commonFunctions";
import { getPaymentByUserId } from "@/utils/Fetch/getPaymentByUserId";
import { getUserDetail } from "@/utils/Fetch/getUserDetail";
import { downloadReceipt } from "@/utils/Fetch/downloadReceipt";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import CreatePayment from "../Dashboard/CreatePayment";
import { updatePaidAt } from "@/utils/Fetch/updatePaidAt";
import { FileDown, SquarePen, X } from "lucide-react";
import Input from "../../Elements/Input";
import Button from "../../Elements/Button";
import NotificationModal from "../Modal/NotificationModal";
type Props = { token: string; user_id: string; onUpdated?: () => void };
export default function TabelPembayaran({ token, user_id, onUpdated }: Props) {
  const { data: session } = useSession();
  console.log("TabelPembayaran");

  const [data, setData] = useState<Payment[]>([]);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [userLogin, setUserLogin] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [editDate, setEditDate] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showGetOTP, setShowGetOTP] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const [editStatus, setEditStatus] = useState(true);
  const [notif, setNotif] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });
  console.log(data);

  const openEditModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setEditDate(payment.tanggal?.slice(0, 10) || "");
    setEditStatus(payment.status);
    setShowModal(true);
    setShowGetOTP(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedPayment) return;
    const res = await updatePaidAt(
      {
        paid_at: editDate,
        payment_id: selectedPayment.payment_id,
        is_paid: editStatus,
        otp: otpCode,
      },
      token
    );

    if (res) {
      setNotif({
        show: true,
        message: "Registrasi berhasil!",
        type: "success",
      });
      setTimeout(() => {
        setNotif({
          show: false,
          message: "",
          type: "success" as "success" | "error",
        });
        setShowModal(false);
        setOtpCode("");
        getPaymentByUserId(user_id, token).then((result) => setData(result));
        onUpdated?.();
      }, 1500);
    } else {
      setNotif({
        show: true,
        message: "Terjadi kesalahan saat update.",
        type: "error",
      });
    }
  };
  function closeModal() {
    setShowModal(false);
    setOtpCode("");
    setNotif({
      show: false,
      message: "",
      type: "success" as "success" | "error",
    });
  }
  const handleGetOTP = async () => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/otp/whatsapp`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wa_number: userLogin?.phone }),
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
      setOtpCode("");
    }

    console.log(res.ok);
    console.log(response);
  };
  useEffect(() => {
    const userId = user_id;
    if (!userId || !token) return;

    getPaymentByUserId(userId, token).then((result) => {
      setData(result);
      setLoading(false);
    });
    getUserDetail(userId, token || "").then((result: UserDetail) => {
      setUser(result);
      setLoading(false);
    });
    getUserDetail(session?.user?.user_id ?? "", token || "").then(
      (result: UserDetail) => {
        setUserLogin(result);
        setLoading(false);
      }
    );
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
        setOtpCode("");
        setNotif({
          show: false,
          message: "",
          type: "success" as "success" | "error",
        });
      }
    }

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [session, user_id, showModal]);
  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => {
        setCooldown((c) => c - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldown]);
  if (loading) return <p className="text-white">Loading...</p>;
  function nameFile(payment: Payment) {
    let paymentFor = payment.billing_date_for
      ? formatTanggalBulan(payment.billing_date_for)
      : "-";
    return `Kwitansi_BooyahNet_${paymentFor.replace(" ", "_")}`;
  }
  return (
    <div className="max-w-80 md:max-w-2xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">
          Data Pembayaran
        </h2>

        <div className="text-white">
          <div className="text-xs">Tagihan Selanjutnya</div>
          <div className="font-bold">
            {nextBillingDate(user?.billing_date!)}
          </div>
        </div>
      </div>
      <hr />
      <div className="relative max-h-[500px] overflow-auto rounded-xl border border-gray-700 ">
        <table className="min-w-full text-sm text-white border border-gray-700">
          <thead className="sticky text-left top-0 bg-gray-900 z-10">
            <tr className="text-gray-100 border-y border-gray-700">
              <th className="py-2 px-2 w-6">No</th>
              <th className="p-2">Tanggal </th>
              <th className="p-2">Tagihan Bulan </th>
              <th className="py-2">Nominal</th>
              <th className="py-2">Status</th>

              {session?.user?.role === "Admin" && (
                <th className="py-2 text-center">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={index}
                  className={`border-y ${
                    item.status ? "bg-green-600" : "bg-red-600/70"
                  }`}
                >
                  <td className="py-2 px-2 w-6 break-words">{index + 1}</td>

                  <td className="p-2 whitespace-nowrap">
                    {formatTanggal(
                      item.status ? item.tanggal : item.billing_date_for
                    )}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {formatTanggalBulan(item.billing_date_for)}
                  </td>
                  <td className="p-2 break-words">
                    {item.nominal.toLocaleString("id-ID")}
                  </td>
                  <td className="p-2 font-bold text-white">
                    {item.status ? "Lunas" : "Belum Lunas"}
                  </td>

                  <td className="p-2 flex justify-center gap-2">
                    {session?.user?.role === "Admin" && (
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-white bg-cyan-600  p-2 rounded text-xs hover:bg-gray-600/30 "
                      >
                        <SquarePen size={20} />
                      </button>
                    )}
                    {item.status && (
                      <button
                        title="Download Kwitansi"
                        onClick={() => {
                          if (session?.user?.token) {
                            downloadReceipt(
                              item.payment_id,
                              session.user.token,
                              nameFile(item)
                            );
                          } else {
                            signOut({ callbackUrl: "/login" });
                          }
                        }}
                        className="text-white bg-cyan-600 flex p-2 rounded text-xs hover:bg-gray-600/30 "
                      >
                        <FileDown size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={session?.user?.role === "Admin" ? 6 : 4}
                  className="text-center py-6 text-white/70 italic bg-gray-800"
                >
                  Belum ada pembayaran
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center z-50 px-5 lg:px-1">
          <div
            ref={modalRef}
            className="relative bg-gray-800 p-6 rounded-xl w-full max-w-md mx-3"
          >
            <h3 className="text-lg font-semibold mb-4">Edit Pembayaran</h3>{" "}
            {/* ❌ Tombol close kanan atas */}
            <button
              onClick={() => closeModal()}
              className="absolute top-3 right-3 p-2 text-white hover:text-red-400"
            >
              <X size={25} />
            </button>
            <label className="block">
              <Input
                label="Tanggal Pembayaran"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1  "
              />
            </label>
            <div className="my-2">
              <span className="text-sm ">Status</span>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="status"
                    value="true"
                    checked={editStatus === true}
                    onChange={() => setEditStatus(true)}
                  />
                  Lunas
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="status"
                    value="false"
                    checked={editStatus === false}
                    onChange={() => setEditStatus(false)}
                  />
                  Belum Lunas
                </label>
              </div>
            </div>
            <div className="gap-2 space-y-2">
              {showGetOTP ? (
                <Button type="button" onClick={handleGetOTP}>
                  Get OTP
                </Button>
              ) : (
                <>
                  <Input
                    placeholder="Masukan Kode OTP"
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value);
                    }}
                    rightButton={{
                      label:
                        cooldown > 0
                          ? `Kirim Ulang (${cooldown}s)`
                          : "Kirim Ulang",
                      onClick: handleGetOTP,
                      disabled: cooldown > 0,
                    }}
                  />
                  <div className="font-light text-amber-300 text-xs text-justify">
                    Ketika klik tombol Submit data payment akan terupdate dan
                    memberikan message ke whatsapp pelanggan
                  </div>
                </>
              )}

              <Button
                onClick={handleEditSubmit}
                disabled={showGetOTP}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                Submit
              </Button>
              <NotificationModal
                message={notif.message}
                type={notif.type}
                show={notif.show}
                onClose={() => setNotif((prev) => ({ ...prev, show: false }))}
              />
            </div>
          </div>
        </div>
      )}
      {user_id && session?.user?.token && (
        <CreatePayment
          user={user}
          token={session.user.token}
          onSuccess={() => {
            getPaymentByUserId(user_id, token).then((result) => {
              setData(result);
              setLoading(false);
              onUpdated?.();
            });
          }}
        />
      )}
    </div>
  );
}
