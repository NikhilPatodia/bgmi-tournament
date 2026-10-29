/** UPI deep link with a fixed amount so GPay / PhonePe prefill the payment. */
export function buildUpiUrl({ upiId, payeeName, amount, note }) {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: Number(amount).toFixed(2),
    cu: "INR",
    tn: String(note || "Nadeflux").slice(0, 80),
  });
  return `upi://pay?${params.toString()}`;
}
