import prisma from "@/lib/prisma";
import { requireUser, apiError } from "@/lib/session";
import { createTournamentSchema } from "@/lib/validations/forms";
import { buildPrizeBreakdown } from "@/lib/prize";
import { toNumber } from "@/lib/utils";

/** GET /api/tournaments — list with optional filters */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const map = searchParams.get("map");
    const mode = searchParams.get("mode");
    const q = searchParams.get("q");

    const where = {
      ...(status ? { status } : { status: { not: "CANCELLED" } }),
      ...(map ? { map } : {}),
      ...(mode ? { mode } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const tournaments = await prisma.tournament.findMany({
      where,
      orderBy: [{ startTime: "asc" }],
      include: {
        host: {
          select: { id: true, name: true, image: true, role: true },
        },
        _count: { select: { registrations: true } },
      },
      take: 60,
    });

    return Response.json({
      tournaments: tournaments.map((t) => ({
        ...t,
        entryFee: toNumber(t.entryFee),
        grossPrizePool: toNumber(t.grossPrizePool),
        netPrizePool: toNumber(t.netPrizePool),
        platformFeePct: toNumber(t.platformFeePct),
      })),
    });
  } catch (error) {
    return apiError(error);
  }
}

/** POST /api/tournaments — create (authenticated host) */
export async function POST(request) {
  try {
    const session = await requireUser();
    const body = await request.json();
    const parsed = createTournamentSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const host = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    const isAdmin = host?.role === "ADMIN";
    const entryFee = Number(data.entryFee) || 0;
    const maxSlots = data.maxSlots;
    const platformFeePct = isAdmin ? 0 : Number(data.platformFeePct) || 10;
    const rank1 = Number(data.prizeRank1) || 0;
    const rank2 = Number(data.prizeRank2) || 0;
    const mostKills = Number(data.prizeMostKills) || 0;
    const sponsoredTotal = rank1 + rank2 + mostKills;

    const grossFromFees = entryFee * maxSlots;
    const platformFee = Math.round((grossFromFees * platformFeePct) / 100);
    const netFromFees = Math.max(0, grossFromFees - platformFee);

    const prizeBreakdown =
      sponsoredTotal > 0
        ? { rank1, rank2, rank3: 0, mvp: mostKills, perKill: 0, sponsored: true }
        : buildPrizeBreakdown(netFromFees, data.prizePreset);
    const gross = sponsoredTotal > 0 ? sponsoredTotal : grossFromFees;
    const net = sponsoredTotal > 0 ? sponsoredTotal : netFromFees;

    // Promote USER → HOST on first create
    await prisma.user.updateMany({
      where: { id: session.user.id, role: "USER" },
      data: { role: "HOST" },
    });

    const tournament = await prisma.tournament.create({
      data: {
        title: data.title,
        description: data.description || null,
        bannerUrl: data.bannerUrl || null,
        mode: data.mode,
        map: data.map,
        startTime: new Date(data.startTime),
        releaseTime: data.releaseTime ? new Date(data.releaseTime) : null,
        maxSlots,
        entryFee,
        platformFeePct,
        grossPrizePool: gross,
        netPrizePool: net,
        prizeBreakdown,
        customRoomId: data.customRoomId || null,
        customRoomPass: data.customRoomPass || null,
        hostId: session.user.id,
        status: "UPCOMING",
      },
    });

    return Response.json(
      {
        tournament: {
          ...tournament,
          entryFee: toNumber(tournament.entryFee),
          grossPrizePool: toNumber(tournament.grossPrizePool),
          netPrizePool: toNumber(tournament.netPrizePool),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return apiError(error);
  }
}
