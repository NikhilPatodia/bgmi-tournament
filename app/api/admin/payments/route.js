import prisma from "@/lib/prisma";
import { requireAdmin, apiError } from "@/lib/session";
import { toNumber } from "@/lib/utils";

/** GET /api/admin/payments — match entries and wallet deposits waiting on a UTR check */
export async function GET() {
  try {
    await requireAdmin();

    const [entries, deposits] = await Promise.all([
      prisma.tournamentRegistration.findMany({
        where: { status: "PENDING_VERIFICATION" },
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
          tournament: { select: { id: true, title: true, entryFee: true } },
        },
        take: 100,
      }),
      prisma.walletTransaction.findMany({
        where: { type: "DEPOSIT", status: "PENDING" },
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
        take: 100,
      }),
    ]);

    return Response.json({
      entries: entries.map((entry) => ({
        ...entry,
        amountPaid: toNumber(entry.amountPaid),
        tournament: {
          ...entry.tournament,
          entryFee: toNumber(entry.tournament.entryFee),
        },
      })),
      deposits: deposits.map((deposit) => ({
        ...deposit,
        amount: toNumber(deposit.amount),
      })),
    });
  } catch (error) {
    return apiError(error);
  }
}
