"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`px-4 py-2 rounded-full w-full transition-colors ${
        disabled
          ? "bg-gray-400 text-white cursor-not-allowed"
          : "bg-cyan-600 text-white hover:bg-cyan-700"
      }`}
    >
      {children}
    </button>
  );
}
