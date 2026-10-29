/** Razorpay checkout is no longer used. Players submit a UPI UTR or screenshot instead. */
export async function POST() {
  return Response.json(
    { error: "Razorpay deposits are disabled. Submit a UPI payment proof instead." },
    { status: 410 }
  );
}
