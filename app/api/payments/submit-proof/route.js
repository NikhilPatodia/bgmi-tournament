import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { requireUser, apiError } from "@/lib/session";
import { manualDepositSchema } from "@/lib/validations/forms";
import { assertUtrAvailable } from "@/lib/upi";

const { Decimal } = Prisma;

/**
 * POST /api/payments/submit-proof
 * Player paid the platform UPI directly. Balance stays unchanged until an admin approves.
 */
export async function POST(request) {
  try {
    const session = await requireUser();
    const body = await request.json();
    const parsed = manualDepositSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { amount, utrNumber, proofScreenshot } = parsed.data;
    const utr = utrNumber?.trim() || null;
    const proof = proofScreenshot?.startsWith("data:image/") ? proofScreenshot : null;

    const transaction = await prisma.$transaction(async (tx) => {
      await assertUtrAvailable(tx, utr);
      return tx.walletTransaction.create({
        data: {
          userId: session.user.id,
          amount: new Decimal(amount),
          type: "DEPOSIT",
          status: "PENDING",
          utrNumber: utr,
          proofScreenshot: proof,
          note: "Manual UPI deposit awaiting admin verification",
        },
      });
    });

    return Response.json(
      {
        transaction: {
          id: transaction.id,
          amount,
          status: transaction.status,
          utrNumber: transaction.utrNumber,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return apiError(error);
  }
}
