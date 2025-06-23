// utils/fetchPembayaran.ts

export type RawPembayaran = {
  payment_id: string;
  paid_at: string;
  amount: string;
  is_paid: boolean;
};

export async function getPaymentByUserId(userId: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/payments/users/${userId}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 404) {
      return []; // kosong
    }

    if (!res.ok) {
      console.log("Gagal mengambil data pembayaran");
    }

    const json = await res.json();

    return json.data?.map((item: RawPembayaran) => ({
      payment_id: item.payment_id,
      tanggal: item.paid_at,
      nominal: parseInt(item.amount),
      status: item.is_paid,
    }));
  } catch (err) {
    console.error("❌ Error saat fetch pembayaran:", err);
    return [];
  }
}
