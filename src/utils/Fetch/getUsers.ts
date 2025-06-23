import { fetchWithAuth } from "../fetchWithAuth";

export async function getUsers(token: string) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/users/withTotalPayments`;

  try {
    const res = await fetchWithAuth(url, token);

    if (!res?.ok) {
      console.log("Gagal mengambil data pengguna");
      return;
    }

    const json = await res.json();
    return json.data; // array user
  } catch (error) {
    console.error("❌ Gagal fetch users:", error);
    return [];
  }
}
