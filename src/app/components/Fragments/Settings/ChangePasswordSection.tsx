"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChangePasswordByOldPasswordForm from "../Form/ChangePasswordByOldPassword";

export default function ChangePasswordSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-3xl mx-auto bg-gray-800/90 p-6 rounded-2xl shadow-lg">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex gap-2 items-center">
          <KeyRound size={23} />
          <h3 className="text-lg font-semibold">Ganti Password</h3>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-4 px-2"
          >
            <ChangePasswordByOldPasswordForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
