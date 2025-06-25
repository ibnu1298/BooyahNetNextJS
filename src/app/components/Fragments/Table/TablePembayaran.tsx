"use client";

import { UserDetail } from "@/types/UserDetail";
import { formatTanggal, nextBillingDate } from "@/utils/commonFunctions";
import { getPaymentByUserId } from "@/utils/Fetch/getPaymentByUserId";
import { getUserDetail } from "@/utils/Fetch/getUserDetail";
import { updateIsPaid } from "@/utils/Fetch/updateIsPaid";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import CreatePayment from "../Dashboard/CreatePayment";
import { updatePaidAt } from "@/utils/Fetch/updatePaidAt";
import { SquarePen } from "lucide-react";
type Props = { token: string; user_id: string; onUpdated?: () => void };
export default function TabelPembayaran({ token, user_id, onUpdated }: Props) {
  const { data: session } = useSession();
  console.log("TabelPembayaran");

  const [data, setData] = useState<Payment[]>([]);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editStatus, setEditStatus] = useState(true);

  const openEditModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setEditDate(payment.tanggal?.slice(0, 10) || "");
    setEditStatus(payment.status);
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedPayment) return;
    const res = await updatePaidAt(
      {
        paid_at: editDate,
        payment_id: selectedPayment.payment_id,
        is_paid: editStatus,
      },
      token
    );

    if (res) {
      setShowModal(false);
      getPaymentByUserId(user_id, token).then((result) => setData(result));
      onUpdated?.();
    }
  };

  const handleToggle = async (item: Payment) => {
    const newStatus = item.status !== true;

    const res = await updateIsPaid(
      {
        user_id: user_id,
        payment_id: item.payment_id,
        is_paid: newStatus,
      },
      token
    );
    onUpdated?.();
    if (res) {
      // Update local state biar toggle langsung berubah
      setData((prev) =>
        prev.map((row) =>
          row.payment_id === item.payment_id
            ? { ...row, status: newStatus ? true : false }
            : row
        )
      );
    }
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
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    }

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [session, user_id, showModal]);

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="backdrop-blur-xs bg-gray-900/50 border border-gray-700 p-6 rounded-2xl shadow  overflow-x-auto">
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">
          Data Pembayaran
        </h2>
        <div>
          <div className="text-xs">Tagihan Selanjutnya</div>
          <div className="font-bold">
            {nextBillingDate(user?.billing_date!)}
          </div>
        </div>
      </div>
      <hr />
      <div className="max-h-[300px] overflow-y-auto  ">
        <table className="sticky w-full  table-auto text-left text-sm text-gray-100 rounded-2xl">
          <thead className="sticky top-0 bg-gray-900 z-10">
            <tr className="text-gray-100 border-y border-gray-700 ">
              <th className="py-2 px-2">No</th>
              <th className="py-2">Tgl Pembayaran</th>
              <th className="py-2  hidden md:table-cell">Nominal (Rp)</th>
              <th className="py-2">Status</th>
              {session?.user?.role === "Admin" && (
                <th className="py-2 hidden md:table-cell">Bayar</th>
              )}
              {session?.user?.role === "Admin" && (
                <th className="py-2">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data && data != undefined ? (
              data.map((item, index) => (
                <tr
                  key={index}
                  className={`border-y px-2.5 py-3 ${
                    item.status ? "bg-green-600" : "bg-red-600/70"
                  }`}
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{formatTanggal(item.tanggal)}</td>
                  <td className="p-2 hidden md:table-cell">
                    {item.nominal.toLocaleString("id-ID")}
                  </td>
                  <td className="p-2 font-bold text-white  ">
                    {item.status ? "Lunas" : "Belum Lunas"}
                  </td>
                  {session?.user?.role === "Admin" && (
                    <td className="p-2 hidden md:table-cell">
                      <input
                        type="checkbox"
                        checked={item.status}
                        onChange={() => handleToggle(item)}
                        className="w-4 h-4 cursor-pointer accent-green-500"
                      />
                    </td>
                  )}
                  {session?.user?.role === "Admin" && (
                    <td className="p-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className=" text-white p-2 rounded text-xs hover:flex hover:bg-gray-600/30"
                      >
                        <SquarePen size={15} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={session?.user?.role === "Admin" ? 6 : 4}
                  className="text-center py-6 text-white/70 italic bg-gray-800 rounded-xl"
                >
                  Belum ada pembayaran
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-5 lg:px-1">
            <div
              ref={modalRef}
              className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md space-y-4"
            >
              <h3 className="text-lg font-semibold">Edit Pembayaran</h3>
              <label className="block">
                <span className="text-sm">Tanggal Pembayaran</span>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1  "
                />
              </label>
              <div>
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
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {user_id && session?.user?.token && (
        <CreatePayment
          user_id={user_id}
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
