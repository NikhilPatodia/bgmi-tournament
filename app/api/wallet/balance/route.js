import prisma from "@/lib/prisma";
import { requireUser, apiError } from "@/lib/session";
import { toNumber } from "@/lib/utils";

/** GET /api/wallet/balance — dual balance + ledger */
export async function GET() {
  try {
    const session = await requireUser();

    const [user, transactions, withdrawals] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          depositBalance: true,
          winningBalance: true,
          bgmiIgn: true,
          bgmiId: true,
          phone: true,
        },
      }),
      prisma.walletTransaction.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.withdrawalRequest.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const depositBalance = toNumber(user.depositBalance);
    const winningBalance = toNumber(user.winningBalance);

    return Response.json({
      depositBalance,
      winningBalance,
      totalBalance: depositBalance + winningBalance,
      profile: {
        bgmiIgn: user.bgmiIgn,
        bgmiId: user.bgmiId,
        phone: user.phone,
      },
      transactions: transactions.map((t) => ({
        ...t,
        amount: toNumber(t.amount),
        balanceAfter: t.balanceAfter != null ? toNumber(t.balanceAfter) : null,
      })),
      withdrawals: withdrawals.map((w) => ({
        ...w,
        amount: toNumber(w.amount),
      })),
    });
  } catch (error) {
    return apiError(error);
  }
}
