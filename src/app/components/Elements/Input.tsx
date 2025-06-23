"use client";

import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { phonePrefixOptions } from "@/constants/phonePrefixes";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isPhoneNumber?: boolean;
  prefix?: string;
  onPrefixChange?: (value: string) => void;
  rightButton?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  rightIcon?: React.ReactNode;
}

export default function Input({
  label,
  type,
  isPhoneNumber,
  prefix = "62",
  onPrefixChange,
  rightButton,
  rightIcon,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (isPhoneNumber) {
      const raw = input.replace(/\D/g, ""); // hanya angka
      if (raw.startsWith("0")) return; // cegah input dengan 0
      props.onChange?.({ ...e, target: { ...e.target, value: raw } });
    } else {
      props.onChange?.(e);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-white text-sm mb-1">{label}</label>}

      <div className="relative w-full">
        <div className="flex items-center w-full rounded-full bg-white/20 focus-within:ring-2 focus-within:ring-cyan-600 overflow-hidden">
          {isPhoneNumber && (
            <select
              value={prefix}
              onChange={(e) => onPrefixChange?.(e.target.value)}
              className="bg-white/20 text-white px-3 py-3.5"
            >
              {phonePrefixOptions.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="text-white bg-gray-900 py-6"
                >
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          <input
            {...props}
            type={isPassword && showPassword ? "text" : type}
            onChange={handleChange}
            className="flex-1 py-3 pl-4 bg-transparent text-white placeholder-gray-300 placeholder-opacity-70 focus:placeholder-transparent focus:outline-none"
            inputMode={isPhoneNumber ? "numeric" : undefined}
            pattern={isPhoneNumber ? "[0-9]*" : undefined}
          />

          {rightButton && (
            <button
              type="button"
              onClick={rightButton.onClick}
              disabled={rightButton.disabled}
              className={`text-sm ${
                rightButton.disabled
                  ? "bg-white/5 text-white/40 text-sm py-3.5 outline-none appearance-none w-80 hover:text-white cursor-not-allowed"
                  : "bg-white/20 text-white text-sm py-3.5 outline-none appearance-none w-28 hover:bg-white/40"
              }`}
            >
              {rightButton.label}
            </button>
          )}
        </div>

        {/* 👇 Tampilkan icon di pojok kanan jika ada dan bukan password */}
        {!isPassword && rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white">
            {rightIcon}
          </div>
        )}

        {/* 👇 Tombol show password */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white opacity-70 hover:opacity-100"
          >
            {showPassword ? (
              <EyeOff size={20} strokeWidth={2} absoluteStrokeWidth />
            ) : (
              <Eye size={20} strokeWidth={2} absoluteStrokeWidth />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
