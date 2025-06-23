"use client";

import { ListUser } from "@/types/UserDetail";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

type Props = {
  data: ListUser[];
  onSelectUser: (id: string) => void;
  user_id: string;
};

function getSummary(users: ListUser[]) {
  return users?.reduce(
    (acc, user) => {
      acc.total += parseInt(user.total_payments || "0", 10);
      acc.paid += parseInt(user.paid_payments || "0", 10);
      acc.unpaid += parseInt(user.unpaid_payments || "0", 10);
      return acc;
    },
    { total: 0, paid: 0, unpaid: 0 }
  );
}

export default function TabelUserPayment({
  data,
  onSelectUser,
  user_id,
}: Props) {
  const [payments, setPayments] = useState({
    total: 0,
    paid: 0,
    unpaid: 0,
  });
  const { data: session } = useSession();
  console.log("TabelUserPayment :" + session?.user?.refreshToken);

  useEffect(() => {
    setPayments(getSummary(data));
    if (!user_id && data?.length > 0) {
      onSelectUser(data[0].id); // auto-select user pertama
    }
  }, [data, user_id, onSelectUser]);

  return (
    <div className="overflow-x-auto bg-gray-900/60 backdrop-blur rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">
        Daftar Pengguna & Riwayat Pembayaran
      </h2>
      <div className="max-h-[300px] overflow-y-auto  ">
        <table className="min-w-full text-sm text-left text-white table-auto">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="px-2 py-2">No</th>
              <th className="px-2 py-2">Nama</th>
              <th className="px-2 py-2 hidden md:table-cell">Email</th>
              <th className="px-2 py-2 hidden md:table-cell">Role</th>
              <th className="px-2 py-2">Belum Lunas</th>
              <th className="px-2 py-2">Lunas</th>
              <th className="px-2 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              data.map((user, index) => (
                <tr
                  key={user.id}
                  onClick={() => onSelectUser(user.id)}
                  className={`cursor-pointer border-t border-gray-800 hover:bg-gray-800/50 ${
                    user_id === user.id
                      ? "bg-green-600/50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 capitalize">{user.name}</td>
                  <td className="px-4 py-2 hidden md:table-cell">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 hidden md:table-cell">
                    {user.role_name}
                  </td>
                  <td className="px-4 py-2 text-red-400">
                    {user.unpaid_payments}
                  </td>
                  <td className="px-4 py-2 text-green-400">
                    {user.paid_payments}
                  </td>
                  <td className="px-4 py-2 font-bold">{user.total_payments}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-4 italic text-gray-300"
                >
                  Tidak ada data pengguna
                </td>
              </tr>
            )}
            <tr className="border-t border-gray-800 text-md font-extrabold bg-gray-700">
              {/* Mobile: colSpan 2 */}
              <td colSpan={2} className="px-4 py-2 md:hidden">
                Total
              </td>

              {/* Desktop: colSpan 4 */}
              <td colSpan={4} className="px-4 py-2 hidden md:table-cell">
                Total
              </td>
              <td className="px-4 py-2 text-red-400">
                {payments?.unpaid ?? 0}
              </td>
              <td className="px-4 py-2 text-green-400">
                {payments?.paid ?? 0}
              </td>
              <td className="px-4 py-2 font-bold">{payments?.total ?? 0}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
