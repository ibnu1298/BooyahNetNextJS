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
    month: "short",
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
  // Hilangkan awalan 62 dan tambahkan 0
  if (phone.startsWith("62")) {
    phone = "0" + phone.slice(2);
  }

  // Format jadi XXXX-XXXX-XXXX
  return phone.replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3");
}
