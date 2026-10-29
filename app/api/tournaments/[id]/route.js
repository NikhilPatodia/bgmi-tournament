import prisma from "@/lib/prisma";
import { apiError, getSession } from "@/lib/session";
import { toNumber } from "@/lib/utils";

/** GET /api/tournaments/:id */
export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const session = await getSession();

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        host: {
          select: { id: true, name: true, image: true, role: true },
        },
        registrations: {
          where: { status: { in: ["CONFIRMED", "PENDING_VERIFICATION"] } },
          orderBy: { slotNumber: "asc" },
          include: {
            members: {
              select: {
                id: true,
                ign: true,
                bgmiId: true,
                isCaptain: true,
                userId: true,
              },
            },
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        },
        results: {
          orderBy: { rank: "asc" },
          include: {
            registration: {
              select: {
                teamName: true,
                slotNumber: true,
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!tournament) {
      return Response.json({ error: "Tournament not found" }, { status: 404 });
    }

    const userId = session?.user?.id;
    const myRegistration = userId
      ? tournament.registrations.find((r) => r.userId === userId)
      : null;

    const isHostOrAdmin =
      userId &&
      (tournament.hostId === userId || session.user.role === "ADMIN");

    // Strip credentials unless released / host / registered & time gate passed
    const now = new Date();
    const credentialsReady =
      tournament.status === "CREDENTIALS_RELEASED" ||
      tournament.status === "LIVE" ||
      (tournament.releaseTime && now >= new Date(tournament.releaseTime));

    const paymentConfirmed = myRegistration?.status === "CONFIRMED";
    const canSeeCredentials =
      isHostOrAdmin || (paymentConfirmed && credentialsReady);

    const { customRoomId, customRoomPass, ...safe } = tournament;
    safe.registrations = safe.registrations.map(
      ({ paymentProof, paymentUtr, ...registration }) => ({
        ...registration,
        amountPaid: toNumber(registration.amountPaid),
      })
    );
    safe.results = (safe.results || []).map((result) => ({
      ...result,
      prizeWon: toNumber(result.prizeWon),
    }));

    return Response.json({
      tournament: {
        ...safe,
        entryFee: toNumber(tournament.entryFee),
        grossPrizePool: toNumber(tournament.grossPrizePool),
        netPrizePool: toNumber(tournament.netPrizePool),
        platformFeePct: toNumber(tournament.platformFeePct),
        customRoomId: canSeeCredentials ? customRoomId : null,
        customRoomPass: canSeeCredentials ? customRoomPass : null,
        credentialsReady,
        myRegistration: myRegistration
          ? {
              id: myRegistration.id,
              slotNumber: myRegistration.slotNumber,
              teamName: myRegistration.teamName,
              status: myRegistration.status,
            }
          : null,
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
