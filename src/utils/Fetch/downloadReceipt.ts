export async function downloadReceipt(
  paymentId: string,
  token: string,
  namefile: string
) {
  try {
    console.log("paymentId PDF:" + paymentId);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/payments/download-receipt/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Gagal download PDF");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${namefile}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert("Gagal download PDF" + err);
  }
}
