"use client";

import ProfileForm from "../Fragments/Form/ProfileForm";
import Navbar from "../Fragments/Navbar";

export default function ProfileLayout() {
  return (
    <div className="bg-[url('/images/bg.jpg')] bg-cover bg-center h-screen w-full min-h-screen flex items-center justify-center">
      <Navbar />
      <div className="backdrop-blur-sm bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-white/30 mx-4">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Profile
        </h2>
        <ProfileForm />
      </div>
    </div>
  );
}
