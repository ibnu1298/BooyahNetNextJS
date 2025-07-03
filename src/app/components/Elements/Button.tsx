"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "danger";
}

export default function Button({
  children,
  disabled,
  variant = "default",
  ...props
}: ButtonProps) {
  const baseStyle = "px-4 py-3 rounded-full w-full transition-colors";

  const variantClass = disabled
    ? "bg-gray-400 text-white cursor-not-allowed"
    : variant === "danger"
    ? "bg-red-600 text-white hover:bg-red-700"
    : "bg-cyan-600 text-white hover:bg-cyan-700";

  return (
    <button
      {...props}
      disabled={disabled}
      className={`${baseStyle} ${variantClass}`}
    >
      {children}
    </button>
  );
}
