// utils/fetchWithAuth.ts
import { signOut } from "next-auth/react";

export async function fetchWithAuth(
  input: RequestInfo,
  sessionToken: string,
  options: RequestInit = {}
) {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${sessionToken}`,
  };

  const response = await fetch(input, { ...options, headers });

  if (response.status === 401) {
    console.warn("Token tidak valid, otomatis sign out.");
    // signOut({ callbackUrl: "/login" });
    return null;
  }

  return response;
}

export async function fetchWithRefresh(
  url: string,
  options: RequestInit,
  accessToken: string,
  refreshToken: string,
  setAccessToken: (token: string) => void
): Promise<Response> {
  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401 && refreshToken) {
    // Minta token baru
    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!refreshRes.ok) {
      throw new Error("Gagal refresh token");
    }

    const refreshData = await refreshRes.json();
    const newAccessToken = refreshData.accessToken;

    setAccessToken(newAccessToken); // update state kamu

    // Ulangi request pakai token baru
    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
  }

  return res;
}
