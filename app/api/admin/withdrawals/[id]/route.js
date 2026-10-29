import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { requireAdmin, apiError } from "@/lib/session";
import { adminWithdrawalSchema } from "@/lib/validations/forms";
import { toNumber } from "@/lib/utils";

const { Decimal } = Prisma;

/** PATCH /api/admin/withdrawals/:id — approve / reject / mark processed */
export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = adminWithdrawalSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { action, utrNumber, adminNote } = parsed.data;

    const updated = await prisma.$transaction(async (tx) => {
      const withdrawal = await tx.withdrawalRequest.findUnique({
        where: { id },
      });

      if (!withdrawal) {
        const err = new Error("Withdrawal not found");
        err.status = 404;
        throw err;
      }

      if (withdrawal.status !== "PENDING" && action !== "PROCESS") {
        const err = new Error("Only pending withdrawals can be reviewed");
        err.status = 400;
        throw err;
      }

      if (action === "REJECT") {
        const user = await tx.user.findUnique({
          where: { id: withdrawal.userId },
          select: { winningBalance: true },
        });
        const refunded =
          toNumber(user.winningBalance) + toNumber(withdrawal.amount);

        await tx.user.update({
          where: { id: withdrawal.userId },
          data: { winningBalance: new Decimal(refunded) },
        });

        await tx.walletTransaction.create({
          data: {
            userId: withdrawal.userId,
            amount: withdrawal.amount,
            balanceAfter: new Decimal(refunded),
            type: "WITHDRAWAL_REFUND",
            status: "SUCCESS",
            referenceId: withdrawal.id,
            note: adminNote || "Withdrawal rejected — balance restored",
          },
        });

        return tx.withdrawalRequest.update({
          where: { id },
          data: {
            status: "REJECTED",
            adminNote: adminNote || null,
            processedAt: new Date(),
          },
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        });
      }

      if (action === "APPROVE") {
        return tx.withdrawalRequest.update({
          where: { id },
          data: {
            status: "APPROVED",
            adminNote: adminNote || null,
            utrNumber: utrNumber || null,
          },
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        });
      }

      // PROCESS — mark as paid with UTR
      if (!utrNumber) {
        const err = new Error("UTR number is required to mark as processed");
        err.status = 400;
        throw err;
      }

      await tx.walletTransaction.updateMany({
        where: {
          referenceId: id,
          type: "WITHDRAWAL_REQUEST",
        },
        data: { status: "SUCCESS" },
      });

      return tx.withdrawalRequest.update({
        where: { id },
        data: {
          status: "PROCESSED",
          utrNumber,
          adminNote: adminNote || null,
          processedAt: new Date(),
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      });
    });

    return Response.json({
      withdrawal: { ...updated, amount: toNumber(updated.amount) },
    });
  } catch (error) {
    return apiError(error);
  }
}

/** GET /api/admin/withdrawals/:id — single withdrawal detail */
export async function GET(_request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const withdrawal = await prisma.withdrawalRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            bgmiIgn: true,
          },
        },
      },
    });

    if (!withdrawal) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({
      withdrawal: { ...withdrawal, amount: toNumber(withdrawal.amount) },
    });
  } catch (error) {
    return apiError(error);
  }
}
