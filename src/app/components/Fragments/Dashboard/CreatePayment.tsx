"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

type Props = {
  user_id: string;
  token: string;
  onSuccess?: () => void;
};

export default function CreatePayment({ user_id, token, onSuccess }: Props) {
  const { data: session } = useSession();
  console.log("CreatePayment");

  const [amount, setAmount] = useState<number>(100000);
  const [paidAt, setPaidAt] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/payments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id,
            amount,
            paid_at: new Date(paidAt).toISOString(),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) console.log(data.message || "Gagal membuat pembayaran");

      setAmount(100000);
      setPaidAt(new Date().toISOString().split("T")[0]);
      onSuccess?.();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
    session?.user?.role;
  };

  return session?.user?.role == "Admin" ? (
    <div className="mt-6 bg-gray-800 p-4 rounded-lg border border-gray-700 text-white">
      <h3 className="text-md font-semibold mb-3">Buat Pembayaran Baru</h3>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
        {/* Pilih Nominal */}
        <select
          className="bg-gray-900 text-white border border-gray-600 rounded px-3 py-2"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
        >
          <option value={50000}>Rp 50.000</option>
          <option value={100000}>Rp 100.000</option>
          <option value={200000}>Rp 200.000</option>
        </select>

        {/* Pilih Tanggal */}
        <input
          type="date"
          className="px-3 py-2 rounded bg-gray-900 text-white border border-gray-600"
          value={paidAt}
          onChange={(e) => setPaidAt(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Create Payment"}
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
}
