import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { requireAdmin, apiError } from "@/lib/session";
import { adminPaymentReviewSchema } from "@/lib/validations/forms";
import { toNumber } from "@/lib/utils";

const { Decimal } = Prisma;

/** PATCH /api/admin/payments/registrations/:id — confirm or release a held slot */
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

    const registration = await prisma.$transaction(async (tx) => {
      const current = await tx.tournamentRegistration.findUnique({
        where: { id },
        include: { tournament: { select: { id: true, entryFee: true, platformFeePct: true, prizeBreakdown: true } } },
      });

      if (!current || current.status !== "PENDING_VERIFICATION") {
        const error = new Error("This entry is not waiting for verification");
        error.status = 400;
        throw error;
      }

      if (action === "REJECT") {
        await tx.tournament.update({
          where: { id: current.tournamentId },
          data: { filledSlots: { decrement: 1 } },
        });
        return tx.tournamentRegistration.update({
          where: { id },
          data: { status: "CANCELLED" },
        });
      }

      const confirmed = await tx.tournamentRegistration.update({
        where: { id },
        data: { status: "CONFIRMED" },
      });

      if (!current.tournament.prizeBreakdown?.sponsored) {
        const paidCount = await tx.tournamentRegistration.count({
          where: { tournamentId: current.tournamentId, status: "CONFIRMED" },
        });
        const fee = toNumber(current.tournament.entryFee);
        const feePct = toNumber(current.tournament.platformFeePct);
        const gross = fee * paidCount;
        const net = Math.max(0, gross - Math.round((gross * feePct) / 100));

        await tx.tournament.update({
          where: { id: current.tournamentId },
          data: {
            grossPrizePool: new Decimal(gross),
            netPrizePool: new Decimal(net),
          },
        });
      }

      return confirmed;
    });

    return Response.json({ registration: { id: registration.id, status: registration.status } });
  } catch (error) {
    return apiError(error);
  }
}
