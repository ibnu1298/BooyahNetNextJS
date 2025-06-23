"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold">
          <Link href="/">BooyahNet</Link>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <ul className="hidden md:flex gap-6 items-center justify-center">
          <li>
            <Link href="/" className="hover:text-purple-400">
              Home
            </Link>
          </li>
          <li>
            <Link href="/profile" className="hover:text-purple-400">
              Profile
            </Link>
          </li>
          {session?.user?.role == "Admin" && (
            <li>
              <Link href="/dashboard" className="hover:text-purple-400">
                Dashboard
              </Link>
            </li>
          )}
          {session && (
            <li>
              <button onClick={handleLogout} className="hover:text-red-400 ">
                LogOut
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden px-4 py-4 space-y-2 bg-gray-800 hover:bg-gray-600">
          <li>
            <Link href="/" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/profile" className="hover:text-purple-400">
              Profile
            </Link>
          </li>
          {session?.user?.role == "Admin" && (
            <li>
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
            </li>
          )}
          {session && (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
}
