"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSession, SessionProvider } from "next-auth/react";
import SessionWatcher from "./components/SessionWatcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {" "}
          <SessionWatcher />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
