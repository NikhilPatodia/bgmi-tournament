import { getUpiConfig } from "@/lib/upi";

/** GET /api/payments/upi — public payee VPA used to render the QR */
export async function GET() {
  const config = getUpiConfig();
  if (!config) {
    return Response.json(
      { error: "Set UPI_ID in the server environment before accepting payments" },
      { status: 503 }
    );
  }
  return Response.json(config);
}
