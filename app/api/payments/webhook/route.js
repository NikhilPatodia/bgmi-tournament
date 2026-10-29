import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { toNumber } from "@/lib/utils";

const { Decimal } = Prisma;

/** POST /api/payments/webhook — Razorpay payment.captured */
export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!verifyWebhookSignature(rawBody, signature)) {
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event?.event;

    if (eventType !== "payment.captured" && eventType !== "order.paid") {
      return Response.json({ ok: true, ignored: true });
    }

    const payment = event?.payload?.payment?.entity;
    if (!payment) {
      return Response.json({ error: "Missing payment entity" }, { status: 400 });
    }

    const paymentId = payment.id;
    const orderId = payment.order_id;
    const userId = payment.notes?.userId;
    const amountRupees = Number(payment.amount) / 100;

    if (!userId || !paymentId) {
      return Response.json({ error: "Missing user or payment id" }, { status: 400 });
    }

    // Idempotent credit via unique gatewayPaymentId
    await prisma.$transaction(async (tx) => {
      const existing = await tx.walletTransaction.findUnique({
        where: { gatewayPaymentId: paymentId },
      });
      if (existing?.status === "SUCCESS") return;

      const pending = await tx.walletTransaction.findFirst({
        where: {
          userId,
          type: "DEPOSIT",
          status: "PENDING",
          OR: [
            { referenceId: orderId },
            { gatewayPaymentId: `order_${orderId}` },
          ],
        },
      });

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { depositBalance: true },
      });
      if (!user) return;

      const newDeposit = toNumber(user.depositBalance) + amountRupees;

      await tx.user.update({
        where: { id: userId },
        data: { depositBalance: new Decimal(newDeposit) },
      });

      if (pending) {
        await tx.walletTransaction.update({
          where: { id: pending.id },
          data: {
            status: "SUCCESS",
            gatewayPaymentId: paymentId,
            balanceAfter: new Decimal(newDeposit),
            note: "Deposit credited via Razorpay webhook",
          },
        });
      } else {
        await tx.walletTransaction.create({
          data: {
            userId,
            amount: new Decimal(amountRupees),
            balanceAfter: new Decimal(newDeposit),
            type: "DEPOSIT",
            status: "SUCCESS",
            gatewayPaymentId: paymentId,
            referenceId: orderId,
            note: "Deposit credited via Razorpay webhook",
          },
        });
      }
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return Response.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
