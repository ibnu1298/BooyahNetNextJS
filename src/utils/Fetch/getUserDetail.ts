import { fetchWithAuth } from "../fetchWithAuth";

export async function getUserDetail(userId: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/users/${userId}`;

  try {
    const res = await fetchWithAuth(url, token);
    if (!res?.ok) {
      console.log("Gagal mengambil data user");
      return;
    }

    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("❌ Error:", err);
    return null;
  }
}
