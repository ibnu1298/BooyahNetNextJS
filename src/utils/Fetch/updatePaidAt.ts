import { fetchWithAuth } from "../fetchWithAuth";

export async function updatePaidAt(
  payload: UpdatePaymentPayload,
  token: string
) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/payments/update`;

  try {
    const res = await fetchWithAuth(url, token, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res?.ok) {
      console.log("Gagal update status pembayaran");
      return;
    }

    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("❌ Error updateIsPaid:", err);
    return null;
  }
}
