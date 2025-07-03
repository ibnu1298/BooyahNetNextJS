"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Input from "../../Elements/Input";
import Select from "../../Elements/Select";
import { UserDetail } from "@/types/UserDetail";
import { nextBillingDate } from "@/utils/commonFunctions";
import Button from "../../Elements/Button";

type Props = {
  user: UserDetail | null;
  token: string;
  onSuccess?: () => void;
};

export default function CreatePayment({ user, token, onSuccess }: Props) {
  const { data: session } = useSession();
  console.log("CreatePayment");

  const [amount, setAmount] = useState<number>(100000);
  const [billingDateFor, setBillingDateFor] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
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
            user_id: user?.user_id,
            amount,
            paid_at: new Date(paidAt).toISOString(),
            billing_date_for: new Date(billingDateFor).toISOString(),
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
      <h3 className="text-xl font-semibold mb-6">Buat Pembayaran Baru</h3>
      <div className="flex flex-col md:flex-row  md:items-end gap-3">
        {/* Pilih Nominal */}
        <Select
          label="Pilih Nominal"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          options={[
            { label: "Rp 50.000", value: 50000 },
            { label: "Rp 100.000", value: 100000 },
            { label: "Rp 200.000", value: 200000 },
          ]}
        />

        {/* Pilih Tanggal */}
        <Input
          label="Dibayar pada :"
          type="date"
          className="px-3 py-2 rounded bg-gray-900 text-white border border-gray-600"
          value={paidAt}
          onChange={(e) => setPaidAt(e.target.value)}
        />
        <Input
          label="Tagihan untuk :"
          type="date"
          className="px-3 py-2 rounded bg-gray-900 text-white border border-gray-600"
          value={billingDateFor}
          onChange={(e) => setBillingDateFor(e.target.value)}
        />
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 justify-end hover:bg-blue-700 text-white px-4 py-3 rounded-full disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Buat"}
        </Button>
      </div>
    </div>
  ) : (
    <></>
  );
}
