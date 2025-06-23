"use client";

import { useState } from "react";
import LoginForm from "../Fragments/Form/LoginForm";
import LoginWhatsAppForm from "../Fragments/Form/LoginWhatsAppForm";
const tabs = [
  { key: "whatsapp", label: "WhatsApp" },
  { key: "email-password", label: "Email & Password" },
  // { key: "email-otp", label: "Email" },
];
export default function LoginLayout() {
  const [activeTab, setActiveTab] = useState("whatsapp");
  const renderForm = () => {
    switch (activeTab) {
      case "email-password":
        return <LoginForm />;
      case "whatsapp":
        return <LoginWhatsAppForm />;
      case "email-otp":
        return <div className="text-white">Form Email OTP belum dibuat</div>; // Ganti dengan <LoginEmailOTPForm />
      default:
        return null;
    }
  };
  return (
    <div className="bg-[url('/images/bg.jpg')] bg-cover bg-center h-screen w-full flex items-center justify-center">
      <div className="backdrop-blur-sm bg-black/40 p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-white/30 mx-5">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Login
        </h2>
        <div className="flex justify-center mb-4 gap-2 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-3 py-1 rounded-full ${
                activeTab === tab.key
                  ? "bg-cyan-600  text-white"
                  : "bg-white/10 text-gray-200"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="min-h-[100px] transition-all duration-300">
          {renderForm()}
          <p className="text-white text-center text-sm mt-4">
            Belum punya akun?{" "}
            <a href="/register" className="font-bold underline">
              Daftar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
