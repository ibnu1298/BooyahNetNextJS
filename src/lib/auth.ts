import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { Session, User } from "next-auth";
import { jwtDecode } from "jwt-decode";
import { decodedToken } from "@/app/interface/decodedToken";
import { JWT } from "next-auth/jwt";
import { DatabaseIcon } from "lucide-react";
async function refreshAccessToken(refreshToken: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/auth/refresh-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    const result = await res.json();

    if (!res.ok || !result.accessToken) {
      return null;
    }

    const decoded = jwtDecode<decodedToken>(result.accessToken as string);

    return {
      accessToken: result.accessToken,
      refreshToken, // pakai refreshToken lama karena tidak dikembalikan di response
      email: decoded.email,
      role: decoded.role,
      exp: decoded.exp,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const result = await res.json();
          console.log(`token:${result.data?.token}`);
          console.log(`refreshToken:${result.data?.refreshToken}`);

          if (!res.ok || !result.data?.token) {
            return null;
          }
          const decoded = jwtDecode<decodedToken>(result.data.token as string);
          return {
            email: credentials.email,
            role: decoded.role,
            token: result.data.token,
            refreshToken: result.data.refreshToken,
          } as User & { token: string; refreshToken: string };
        } catch (err) {
          console.error("Login error:", err);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "wa-login", // ini buat login via WhatsApp
      name: "WA Login",
      credentials: {
        wa_number: { label: "Nomor WA", type: "text" },
        otp: { label: "Kode OTP", type: "text" },
      },
      authorize: async (credentials): Promise<User | null> => {
        if (!credentials) return null;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/auth/login-wa`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                wa_number: credentials.wa_number,
                otp: credentials.otp,
              }),
            }
          );

          const result = await res.json();
          console.log(result);

          if (!res.ok || !result.data?.token) {
            console.log(result.message || "Login gagal");
          }
          const decoded = jwtDecode<decodedToken>(result.data.token as string);

          return {
            email: result.data.email,
            token: result.data.token,
            role: decoded.role,
            refreshToken: result.data.refreshToken,
          } as User & {
            token: string;
            refreshToken: string;
          };
        } catch (err) {
          console.error("WA login error:", err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // First time login
      if (user?.token) {
        token.accessToken = user.token;
        token.refreshToken = user.refreshToken;
        token.email = user.email;
        token.role = user.role;
        console.log("user?.token" + user.token);

        const decoded = jwtDecode<decodedToken>(user.token as string);
        token.exp = decoded.exp;
        return token;
      }

      // After initial login: token is being reused
      const now = Math.floor(Date.now() / 1000);
      const decoded = jwtDecode<decodedToken>(token.accessToken as string);
      const decodedref = jwtDecode<decodedToken>(token.refreshToken as string);
      console.log(
        "accessToken : " + new Date(decoded.exp * 1000).toLocaleString()
      );
      console.log(
        "refreshToken : " + new Date(decodedref.exp * 1000).toLocaleString()
      );

      if (decoded.exp && decoded.exp < now) {
        console.log("🔁 Token expired, refreshing...");
        const refreshed = await refreshAccessToken(
          token.refreshToken as string
        );
        console.log("✅ Token expired, done");

        if (refreshed) {
          console.log("refreshed: " + true);

          token.accessToken = refreshed.accessToken;
          token.refreshToken = refreshed.refreshToken;
          token.email = refreshed.email;
          token.role = refreshed.role;
          token.exp = refreshed.exp;
        } else {
          console.log("refreshed: " + false);
          return {} as unknown as JWT;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (!token || !token.accessToken) {
        console.warn("⚠️ No valid token, session terminated.");
        return {
          ...session,
          user: {
            name: null,
            email: null,
            image: null,
          },
          accessToken: undefined,
        } as Session;
      }
      session.accessToken = token.accessToken;
      if (session.user && typeof token.accessToken === "string") {
        const decoded = jwtDecode<decodedToken>(token.accessToken as string);
        session.user.user_id = decoded.userId;
        session.user.email = token.email;
        session.user.role = decoded.role;
        session.user.expired = decoded.exp;
        session.user.token = token.accessToken;
        session.user.refreshToken = token.refreshToken;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
