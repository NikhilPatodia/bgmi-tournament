import prisma from "@/lib/prisma";
import { requireAdmin, apiError } from "@/lib/session";
import { toNumber } from "@/lib/utils";

/** GET /api/admin/tournaments — every match, including cancelled */
export async function GET() {
  try {
    await requireAdmin();

    const tournaments = await prisma.tournament.findMany({
      orderBy: { startTime: "desc" },
      include: {
        host: { select: { id: true, name: true } },
        _count: { select: { registrations: true } },
      },
      take: 100,
    });

    return Response.json({
      tournaments: tournaments.map((tournament) => ({
        ...tournament,
        entryFee: toNumber(tournament.entryFee),
        netPrizePool: toNumber(tournament.netPrizePool),
      })),
    });
  } catch (error) {
    return apiError(error);
  }
}
