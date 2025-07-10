"use client";

import { getPaymentByUserId } from "@/utils/Fetch/getPaymentByUserId";
import { BanknoteX } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function StatCards() {
  const { data: session } = useSession();

  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = session?.user?.user_id;
    const token = session?.user?.token;

    if (!userId || !token) return;

    getPaymentByUserId(userId, token).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [session]);

  const totalBelumLunas =
    data == undefined
      ? 0
      : data
          .filter((item: any) => item.status === false)
          .reduce((total, item) => total + (Number(item.nominal) || 0), 0);
  const totalDataBelumLunas =
    data == undefined
      ? 0
      : data.filter((item: any) => item.status === false).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-gray-800 p-4 rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Total Tagihan</p>
          <h3 className="text-xl font-semibold text-white">
            {!loading ? (
              <>Rp {totalBelumLunas.toLocaleString("id-ID")}</>
            ) : (
              <>Loading...</>
            )}
          </h3>
          <p className="text-xs text-green-400 mt-1">
            {totalDataBelumLunas === 0 ? (
              <>Belum ada tagihan</>
            ) : (
              <>{totalDataBelumLunas} bulan belum di bayar</>
            )}
          </p>
        </div>
        <div className="bg-gray-700 p-2 rounded-lg text-white">
          <BanknoteX size={20} />
        </div>
      </div>
    </div>
  );
}
