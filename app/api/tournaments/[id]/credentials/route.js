import prisma from "@/lib/prisma";
import { requireUser, apiError } from "@/lib/session";

/** GET /api/tournaments/:id/credentials — room id/pass for registered players */
export async function GET(_request, { params }) {
  try {
    const session = await requireUser();
    const { id } = await params;

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        releaseTime: true,
        customRoomId: true,
        customRoomPass: true,
        hostId: true,
        startTime: true,
      },
    });

    if (!tournament) {
      return Response.json({ error: "Tournament not found" }, { status: 404 });
    }

    const registration = await prisma.tournamentRegistration.findUnique({
      where: {
        tournamentId_userId: {
          tournamentId: id,
          userId: session.user.id,
        },
      },
      select: { id: true, status: true, slotNumber: true },
    });

    const isHost = tournament.hostId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!registration && !isHost && !isAdmin) {
      return Response.json(
        { error: "You must be registered to view room credentials" },
        { status: 403 }
      );
    }

    if (registration?.status === "PENDING_VERIFICATION" && !isHost && !isAdmin) {
      return Response.json({
        ready: false,
        message: "Room credentials unlock after an admin approves your UPI payment",
      });
    }

    const now = new Date();
    const ready =
      isHost ||
      isAdmin ||
      tournament.status === "CREDENTIALS_RELEASED" ||
      tournament.status === "LIVE" ||
      (tournament.releaseTime && now >= new Date(tournament.releaseTime));

    if (!ready) {
      return Response.json({
        ready: false,
        releaseTime: tournament.releaseTime,
        startTime: tournament.startTime,
        message: "Credentials will unlock closer to match start",
      });
    }

    if (!tournament.customRoomId || !tournament.customRoomPass) {
      return Response.json({
        ready: true,
        available: false,
        message: "Host has not published room credentials yet",
      });
    }

    return Response.json({
      ready: true,
      available: true,
      customRoomId: tournament.customRoomId,
      customRoomPass: tournament.customRoomPass,
      slotNumber: registration?.slotNumber ?? null,
    });
  } catch (error) {
    return apiError(error);
  }
}
