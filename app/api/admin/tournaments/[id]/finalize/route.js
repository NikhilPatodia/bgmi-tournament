import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { requireAdmin, apiError } from "@/lib/session";
import { finalizeTournamentSchema } from "@/lib/validations/forms";
import { computePrizeWon } from "@/lib/prize";
import { toNumber } from "@/lib/utils";

const { Decimal } = Prisma;

/**
 * POST /api/admin/tournaments/:id/finalize
 * Enter results, credit winning balances, mark COMPLETED.
 */
export async function POST(request, { params }) {
  try {
    await requireAdmin();
    const { id: tournamentId } = await params;
    const body = await request.json();
    const parsed = finalizeTournamentSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { results: submitted } = parsed.data;
    const summary = await prisma.$transaction(async (tx) => {
      const tournament = await tx.tournament.findUnique({
        where: { id: tournamentId },
      });

      if (!tournament) {
        const err = new Error("Tournament not found");
        err.status = 404;
        throw err;
      }

      if (tournament.status === "COMPLETED") {
        const err = new Error("Tournament already finalized");
        err.status = 400;
        throw err;
      }

      const mvpPrize = Number(tournament.prizeBreakdown?.mvp || 0);
      let results = submitted;
      if (mvpPrize > 0 && !results.some((row) => row.isMvp)) {
        const top = results.reduce((best, row) => {
          if (!best || row.kills > best.kills) return row;
          if (row.kills === best.kills && row.rank < best.rank) return row;
          return best;
        }, null);
        results = results.map((row) => ({
          ...row,
          isMvp: Boolean(top && row.registrationId === top.registrationId && row.kills > 0),
        }));
      }

      const payouts = [];

      for (const row of results) {
        const registration = await tx.tournamentRegistration.findFirst({
          where: {
            id: row.registrationId,
            tournamentId,
            status: "CONFIRMED",
          },
        });

        if (!registration) {
          const err = new Error(`Invalid registration ${row.registrationId}`);
          err.status = 400;
          throw err;
        }

        const killPoints =
          row.killPoints || row.kills; /* 1 pt per kill default */
        const totalPoints = (row.placementPoints || 0) + killPoints;
        const prizeWon = computePrizeWon(tournament, {
          rank: row.rank,
          kills: row.kills,
          isMvp: row.isMvp,
        });

        await tx.tournamentResult.upsert({
          where: { registrationId: registration.id },
          create: {
            tournamentId,
            registrationId: registration.id,
            rank: row.rank,
            kills: row.kills,
            placementPoints: row.placementPoints || 0,
            killPoints,
            totalPoints,
            prizeWon: new Decimal(prizeWon),
            isMvp: Boolean(row.isMvp),
            proofScreenshot: row.proofScreenshot || null,
          },
          update: {
            rank: row.rank,
            kills: row.kills,
            placementPoints: row.placementPoints || 0,
            killPoints,
            totalPoints,
            prizeWon: new Decimal(prizeWon),
            isMvp: Boolean(row.isMvp),
            proofScreenshot: row.proofScreenshot || null,
          },
        });

        if (prizeWon > 0) {
          const user = await tx.user.findUnique({
            where: { id: registration.userId },
            select: { winningBalance: true },
          });
          const newWinning = toNumber(user.winningBalance) + prizeWon;

          await tx.user.update({
            where: { id: registration.userId },
            data: { winningBalance: new Decimal(newWinning) },
          });

          await tx.walletTransaction.create({
            data: {
              userId: registration.userId,
              amount: new Decimal(prizeWon),
              balanceAfter: new Decimal(newWinning),
              type: "PRIZE_PAYOUT",
              status: "SUCCESS",
              referenceId: tournamentId,
              note: `Prize for rank #${row.rank}${row.isMvp ? " + MVP" : ""}`,
            },
          });

          payouts.push({
            userId: registration.userId,
            registrationId: registration.id,
            prizeWon,
          });
        }
      }

      await tx.tournament.update({
        where: { id: tournamentId },
        data: { status: "COMPLETED" },
      });

      return { payouts, count: results.length };
    });

    return Response.json({ ok: true, ...summary });
  } catch (error) {
    return apiError(error);
  }
}
