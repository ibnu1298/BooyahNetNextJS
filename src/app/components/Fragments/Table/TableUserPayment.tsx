"use client";

import { ListUser } from "@/types/UserDetail";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";

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
  const [sortBy, setSortBy] = useState<keyof ListUser>("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field: any) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!data) return [];
    const sorted = [...data].sort((a, b) => {
      const valA = a[sortBy] ?? "";
      const valB = b[sortBy] ?? "";

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
    return sorted;
  }, [data, sortBy, sortDirection]);
  useEffect(() => {
    setPayments(getSummary(data));
    if (!user_id && data?.length > 0) {
      onSelectUser(data[0].id); // auto-select user pertama
    }
  }, [data, user_id, onSelectUser]);

  return (
    <div className="max-w-4xl  overflow-x-auto bg-gray-900/60 backdrop-blur rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">
        Daftar Pengguna & Riwayat Pembayaran
      </h2>
      <div className="w-full overflow-x-auto px-2 max-h-[300px] overflow-y-auto ">
        <table className="w-full table-fixed text-left text-sm text-gray-100">
          <thead className="sticky -top-0.5 bg-gray-900 z-20">
            <tr className="text-gray-100 border-b border-gray-700">
              <th
                onClick={() => handleSort("no")}
                className="px-2 py-2 cursor-pointer"
              >
                No
              </th>
              <th
                onClick={() => handleSort("name")}
                className="px-2 py-2 cursor-pointer"
              >
                Nama{" "}
                {sortBy === "name" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("email")}
                className="px-2 py-2 hidden md:table-cell cursor-pointer"
              >
                Email{" "}
                {sortBy === "email" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("role_name")}
                className="px-2 py-2 hidden md:table-cell cursor-pointer"
              >
                Role{" "}
                {sortBy === "role_name" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("unpaid_payments")}
                className="px-2 py-2 cursor-pointer"
              >
                Belum Lunas{" "}
                {sortBy === "unpaid_payments" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("paid_payments")}
                className="px-2 py-2 cursor-pointer"
              >
                Lunas{" "}
                {sortBy === "paid_payments" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("total_payments")}
                className="px-2 py-2 cursor-pointer"
              >
                Total{" "}
                {sortBy === "total_payments" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData?.length > 0 ? (
              sortedData.map((user, index) => (
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
                  <td className="px-4 py-2 hidden md:table-cell truncate max-w-[180px]">
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
            <tr className="border-t border-gray-800 text-md font-extrabold bg-gray-700 sticky z-20 -bottom-0.5">
              <td colSpan={2} className="px-4 py-2 md:hidden">
                Total
              </td>
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
