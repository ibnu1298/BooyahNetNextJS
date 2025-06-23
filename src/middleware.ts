import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { decodedToken } from "./app/interface/decodedToken";
import { jwtDecode } from "jwt-decode";

export default withAuth(
  async function middleware(req) {
    console.log("🔥 Middleware triggered:", req.nextUrl.pathname);

    const { pathname } = req.nextUrl;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token?.refreshToken) {
      console.log("refreshtoken middleware: " + token?.refreshToken);
      const decoded = jwtDecode<decodedToken>(token.refreshToken);
      console.log(
        "middleware-refresftoken: " +
          new Date(decoded.exp * 1000).toLocaleString()
      );

      if (Date.now() >= decoded.exp * 1000) {
        // redirect ke session expired page
        return NextResponse.redirect(new URL("/session-expired", req.url));
      }
    }
    // ❌ Token default (tanpa accessToken), kita anggap invalid → paksa signout
    if (token && !token.accessToken && pathname !== "/login") {
      return NextResponse.redirect(new URL("/session-expired", req.url));
    }

    // ❌ Kalau user sudah login → redirect dari /login & /register ke /
    if (token && ["/login", "/register"].includes(pathname)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // ❌ Kalau buka dashboard tapi bukan admin → redirect ke /
    if (pathname.startsWith("/dashboard") && token?.role! !== "Admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // ✅ Selalu izinkan middleware jalan supaya bisa atur redirect manual
      authorized: () => true,
    },
  }
);

// 🧠 Pastikan middleware aktif di semua path yang perlu dicek
export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*"],
};
