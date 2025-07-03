"use client";

import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string | number }[];
}

export default function Select({ label, options, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-white text-sm mb-1">{label}</label>}
      <select
        {...props}
        className="h-12 px-4 rounded-full bg-white/20 text-white placeholder-gray-300 
          focus:outline-none focus:ring-2 focus:ring-cyan-600 transition-colors"
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-gray-900 text-white"
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
