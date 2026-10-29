import prisma from "@/lib/prisma";
import { requireAdmin, apiError } from "@/lib/session";
import { updateTournamentSchema } from "@/lib/validations/forms";
import { toNumber } from "@/lib/utils";
import { buildPrizeBreakdown } from "@/lib/prize";

/** PATCH /api/admin/tournaments/:id — edit match details and room credentials */
export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = updateTournamentSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const current = await prisma.tournament.findUnique({
      where: { id },
      select: { id: true, filledSlots: true, prizeBreakdown: true },
    });

    if (!current) {
      return Response.json({ error: "Tournament not found" }, { status: 404 });
    }

    const data = parsed.data;
    if (data.maxSlots < current.filledSlots) {
      return Response.json(
        { error: `Max slots cannot be below the ${current.filledSlots} already taken` },
        { status: 400 }
      );
    }

    const rank1 = Number(data.prizeRank1) || 0;
    const rank2 = Number(data.prizeRank2) || 0;
    const mostKills = Number(data.prizeMostKills) || 0;
    const rank3 = Number(current.prizeBreakdown?.rank3) || 0;
    const sponsoredTotal = rank1 + rank2 + rank3 + mostKills;
    const grossFromFees = Number(data.entryFee) * data.maxSlots;
    const useFixedPrizes = sponsoredTotal > 0;
    const prizeBreakdown = useFixedPrizes
      ? { rank1, rank2, rank3, mvp: mostKills, perKill: 0, sponsored: true }
      : buildPrizeBreakdown(grossFromFees, "STANDARD");
    const pool = useFixedPrizes ? sponsoredTotal : grossFromFees;

    const tournament = await prisma.tournament.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
        mode: data.mode,
        map: data.map,
        status: data.status,
        startTime: new Date(data.startTime),
        releaseTime: data.releaseTime ? new Date(data.releaseTime) : null,
        maxSlots: data.maxSlots,
        entryFee: data.entryFee,
        platformFeePct: 0,
        grossPrizePool: pool,
        netPrizePool: pool,
        prizeBreakdown,
        customRoomId: data.customRoomId || null,
        customRoomPass: data.customRoomPass || null,
      },
    });

    return Response.json({
      tournament: {
        ...tournament,
        entryFee: toNumber(tournament.entryFee),
        netPrizePool: toNumber(tournament.netPrizePool),
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
