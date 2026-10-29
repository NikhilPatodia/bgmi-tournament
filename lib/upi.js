import prisma from "@/lib/prisma";
import { buildUpiUrl } from "@/lib/upi-link";

export { buildUpiUrl };

export function getUpiConfig() {
  const upiId = process.env.UPI_ID?.trim();
  const payeeName = process.env.UPI_PAYEE_NAME?.trim() || "Nadeflux Esports";
  if (!upiId || upiId.includes("yourname@")) {
    return null;
  }
  return { upiId, payeeName };
}

export async function assertUtrAvailable(db, utr) {
  const value = String(utr || "").trim();
  if (value.length < 6) return;

  const client = db || prisma;
  const [registration, deposit] = await Promise.all([
    client.tournamentRegistration.findFirst({
      where: {
        paymentUtr: value,
        status: { in: ["PENDING_VERIFICATION", "CONFIRMED"] },
      },
      select: { id: true },
    }),
    client.walletTransaction.findFirst({
      where: {
        utrNumber: value,
        type: "DEPOSIT",
        status: { in: ["PENDING", "SUCCESS"] },
      },
      select: { id: true },
    }),
  ]);

  if (registration || deposit) {
    const error = new Error("This UTR was already submitted");
    error.status = 409;
    throw error;
  }
}
