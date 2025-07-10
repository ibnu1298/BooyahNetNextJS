"use client";

import { useEffect, useMemo, useState } from "react";

import { BadgeCheck, BadgeX, Pencil, SquarePen } from "lucide-react";
import Button from "../../Elements/Button";
import { formatPhone, formatTanggal } from "@/utils/commonFunctions";
import { useSession } from "next-auth/react";
import EditUserModal from "../Modal/EditUserModalAdmin";
import { UserDetail } from "@/types/UserDetail";

export default function TableUserDetail() {
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [sortBy, setSortBy] = useState<keyof UserDetail>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof UserDetail) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const sortedUsers = useMemo(() => {
    if (!users) return [];
    return [...users].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (
        sortBy === "is_subscribe" ||
        sortBy === "verify_email" ||
        sortBy === "verify_phone"
      ) {
        valA = a[sortBy] ? true : false;
        valB = b[sortBy] ? true : false;
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      return sortDirection === "asc"
        ? String(valA ?? "").localeCompare(String(valB ?? ""))
        : String(valB ?? "").localeCompare(String(valA ?? ""));
    });
  }, [users, sortBy, sortDirection]);
  const handleCopy = (data: string) => {
    if (!data) return;
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Balik lagi ke normal setelah 1.5 detik
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/users`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          console.error("Gagal ambil data:", data.message);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        console.log("data apa" + users);

        setLoading(false);
      }
    };

    if (session?.user?.token) fetchUsers();
  }, [session?.user?.token]);
  console.log(
    "user ids:",
    users.map((u) => u.user_id)
  );
  return (
    <div className="max-w-80 md:max-w-3xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">User Detail</h2>
      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <div className="relative max-h-[500px] overflow-auto rounded-xl border border-gray-700 ">
          <table className="min-w-full text-sm text-white border border-gray-700">
            <thead className="bg-gray-700 text-left sticky -top-0.5 z-30">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="px-4 py-2 sticky -left-0.5 bg-gray-700 z-20 cursor-pointer"
                >
                  Nama{" "}
                  {sortBy === "name" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="px-4 py-2 cursor-pointer"
                >
                  Email{" "}
                  {sortBy === "email" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("phone")}
                  className="px-4 py-2 cursor-pointer"
                >
                  No. WA{" "}
                  {sortBy === "phone" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("address")}
                  className="px-4 py-2 cursor-pointer"
                >
                  Alamat{" "}
                  {sortBy === "address" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("billing_date")}
                  className="px-4 py-2 cursor-pointer"
                >
                  Billing Date{" "}
                  {sortBy === "billing_date" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("is_subscribe")}
                  className="px-4 py-2 cursor-pointer"
                >
                  Pelanggan{" "}
                  {sortBy === "is_subscribe" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("role_name")}
                  className="px-4 py-2 cursor-pointer"
                >
                  Role{" "}
                  {sortBy === "role_name" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.length > 0 ? (
                sortedUsers.map((user) => (
                  <tr
                    key={user.user_id}
                    className="border-t border-gray-700 hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-2 truncate max-w-32 sticky -left-0.5 bg-gray-800 z-10">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                        className="p-3 flex items-center gap-3 cursor-pointer"
                        title={`Edit Data ${user.name}`}
                      >
                        <SquarePen size={16} className="text-white" />
                        {user.name}
                      </button>
                    </td>
                    <td className="px-4 py-2 truncate">
                      <div className="flex gap-2">
                        {user.email}
                        {user.verify_email ? (
                          <BadgeCheck className="text-green-400" size={18} />
                        ) : (
                          <BadgeX className="text-gray-400" size={18} />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        {formatPhone(user?.phone ?? "-")}
                        {user.verify_phone ? (
                          <BadgeCheck className="text-green-400" size={18} />
                        ) : (
                          <BadgeX className="text-gray-400" size={18} />
                        )}
                      </div>
                    </td>
                    <td
                      className="px-4 py-2 truncate max-w-32 cursor-pointer"
                      title={user.address ?? "-"}
                      onClick={() => handleCopy(user.address ?? "-")}
                    >
                      {user.address ?? "-"}
                    </td>
                    <td className="px-4 py-2 truncate">
                      {user.billing_date
                        ? formatTanggal(user.billing_date)
                        : "-"}
                    </td>
                    <td
                      className={`px-4 py-2 ${
                        user.is_subscribe ? "bg-green-600" : "bg-red-700/50"
                      }`}
                    >
                      {user.is_subscribe ? "Aktif" : "Non-Aktif"}
                    </td>
                    <td className="px-4 py-2">{user.role_name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center px-4 py-4 text-white/50"
                  >
                    Tidak ada data user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <EditUserModal
            show={showModal}
            user={selectedUser}
            onClose={() => setShowModal(false)}
            onSave={(updatedUser) => {
              // Opsional update state
              setUsers((prev) =>
                prev.map((u) =>
                  u.user_id === updatedUser.user_id ? updatedUser : u
                )
              );
            }}
          />
        </div>
      )}
    </div>
  );
}
