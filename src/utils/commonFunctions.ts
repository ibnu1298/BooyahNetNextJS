import { phonePrefixOptions } from "@/constants/phonePrefixes";

export function capitalizeName(name: string) {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getAgeFromDate(dateString: string): number {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function formatTanggal(tanggal: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(tanggal));
}
export function formatTanggalBulan(tanggal: string) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(tanggal));
}

export function nextBillingDate(dateString: string): string {
  const prevDate = new Date(dateString);
  const today = new Date();

  // Ambil hari billing (misalnya: 4)
  const billingDay = prevDate.getUTCDate();

  // Buat tanggal billing berikutnya (bulan ini atau bulan depan)
  let next = new Date(today.getFullYear(), today.getMonth(), billingDay);

  if (today.getDate() >= billingDay) {
    // Kalau hari ini sudah lewat tanggal billing, majukan ke bulan berikutnya
    next = new Date(today.getFullYear(), today.getMonth() + 1, billingDay);
  }

  // Format: 04 Juli 2025
  return next.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatPhone(phone: string): string {
  const matchedPrefix = phonePrefixOptions.find((option) =>
    phone.startsWith(option.value)
  );

  if (!matchedPrefix) {
    return phone; // Jika tidak cocok, kembalikan apa adanya
  }

  // Jika prefix "62", ubah jadi format Indonesia (awali dengan 0)
  if (matchedPrefix.value === "62") {
    return "0" + phone.slice(2);
  }

  // Selain itu, tambahkan "+"
  return "+" + phone;
}

export function validatePassword(password: string): string[] {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Minimal 8 karakter");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Harus mengandung huruf besar (A-Z)");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Harus mengandung huruf kecil (a-z)");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Harus mengandung angka (0-9)");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Harus mengandung simbol (!@#$...)");
  }

  return errors;
}
