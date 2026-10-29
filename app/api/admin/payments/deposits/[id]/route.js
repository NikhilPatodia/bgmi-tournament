import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { requireAdmin, apiError } from "@/lib/session";
import { adminPaymentReviewSchema } from "@/lib/validations/forms";
import { toNumber } from "@/lib/utils";

const { Decimal } = Prisma;

/** PATCH /api/admin/payments/deposits/:id — credit or reject a manual UPI top-up */
export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = adminPaymentReviewSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { action } = parsed.data;

    const transaction = await prisma.$transaction(async (tx) => {
      const current = await tx.walletTransaction.findUnique({ where: { id } });
      if (!current || current.type !== "DEPOSIT" || current.status !== "PENDING") {
        const error = new Error("This deposit is not waiting for verification");
        error.status = 400;
        throw error;
      }

      if (action === "REJECT") {
        return tx.walletTransaction.update({
          where: { id },
          data: {
            status: "FAILED",
            note: "Manual UPI deposit rejected",
          },
        });
      }

      const user = await tx.user.findUnique({
        where: { id: current.userId },
        select: { depositBalance: true },
      });
      const credited = toNumber(user.depositBalance) + toNumber(current.amount);

      await tx.user.update({
        where: { id: current.userId },
        data: { depositBalance: new Decimal(credited) },
      });

      return tx.walletTransaction.update({
        where: { id },
        data: {
          status: "SUCCESS",
          balanceAfter: new Decimal(credited),
          note: "Manual UPI deposit approved",
        },
      });
    });

    return Response.json({
      transaction: { id: transaction.id, status: transaction.status },
    });
  } catch (error) {
    return apiError(error);
  }
}
