import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { requireUser, apiError } from "@/lib/session";
import { withdrawalSchema } from "@/lib/validations/forms";
import { toNumber } from "@/lib/utils";

const { Decimal } = Prisma;

/** POST /api/wallet/withdraw — request payout from winning balance only */
export async function POST(request) {
  try {
    const session = await requireUser();
    const body = await request.json();
    const parsed = withdrawalSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { amount, upiId } = parsed.data;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { winningBalance: true },
      });

      if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        throw err;
      }

      const winning = toNumber(user.winningBalance);
      if (amount > winning) {
        const err = new Error("Amount exceeds winning balance");
        err.status = 400;
        throw err;
      }

      const newWinning = winning - amount;

      await tx.user.update({
        where: { id: session.user.id },
        data: { winningBalance: new Decimal(newWinning) },
      });

      const withdrawal = await tx.withdrawalRequest.create({
        data: {
          userId: session.user.id,
          amount: new Decimal(amount),
          upiId,
          status: "PENDING",
        },
      });

      await tx.walletTransaction.create({
        data: {
          userId: session.user.id,
          amount: new Decimal(-amount),
          balanceAfter: new Decimal(newWinning),
          type: "WITHDRAWAL_REQUEST",
          status: "PENDING",
          referenceId: withdrawal.id,
          note: `Withdrawal to ${upiId}`,
        },
      });

      return withdrawal;
    });

    return Response.json(
      { withdrawal: { ...result, amount: toNumber(result.amount) } },
      { status: 201 }
    );
  } catch (error) {
    return apiError(error);
  }
}
