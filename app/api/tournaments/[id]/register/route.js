import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { requireUser, apiError } from "@/lib/session";
import { tournamentRegistrationSchema } from "@/lib/validations/forms";
import { membersForMode, toNumber } from "@/lib/utils";
import { assertUtrAvailable } from "@/lib/upi";

const { Decimal } = Prisma;

/**
 * POST /api/tournaments/:id/register
 * ACID interactive transaction with slot concurrency protection.
 */
export async function POST(request, { params }) {
  try {
    const session = await requireUser();
    const { id: tournamentId } = await params;
    const body = await request.json();
    const parsed = tournamentRegistrationSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { slotNumber, teamName, members, paymentUtr, paymentProof } = parsed.data;
    const userId = session.user.id;

    const registration = await prisma.$transaction(
      async (tx) => {
        const locked = await tx.$queryRaw`
          SELECT id, status, "maxSlots", "filledSlots", "entryFee", mode, "startTime"
          FROM tournament
          WHERE id = ${tournamentId}
          FOR UPDATE
        `;

        const tournament = locked?.[0];
        if (!tournament) {
          const err = new Error("Tournament not found");
          err.status = 404;
          throw err;
        }

        if (tournament.status !== "UPCOMING") {
          const err = new Error("Registration is closed for this tournament");
          err.status = 400;
          throw err;
        }

        if (slotNumber < 1 || slotNumber > tournament.maxSlots) {
          const err = new Error("Invalid slot number");
          err.status = 400;
          throw err;
        }

        if (tournament.filledSlots >= tournament.maxSlots) {
          const err = new Error("Tournament is full");
          err.status = 409;
          throw err;
        }

        const expectedMembers = membersForMode(tournament.mode);
        if (members.length !== expectedMembers) {
          const err = new Error(
            `This ${tournament.mode} match requires exactly ${expectedMembers} roster member(s)`
          );
          err.status = 400;
          throw err;
        }

        const existingUserReg = await tx.tournamentRegistration.findUnique({
          where: {
            tournamentId_userId: { tournamentId, userId },
          },
        });
        if (existingUserReg) {
          const err = new Error("You are already registered for this tournament");
          err.status = 409;
          throw err;
        }

        const existingSlot = await tx.tournamentRegistration.findUnique({
          where: {
            tournamentId_slotNumber: { tournamentId, slotNumber },
          },
        });
        if (existingSlot) {
          const err = new Error("This slot was just taken — pick another");
          err.status = 409;
          throw err;
        }

        const entryFee = toNumber(tournament.entryFee);
        const utr = paymentUtr?.trim() || "";
        const proof = paymentProof?.startsWith("data:image/") ? paymentProof : "";
        const needsPayment = entryFee > 0;

        if (needsPayment && utr.length < 6 && !proof) {
          const err = new Error("Pay the UPI QR, then enter the UTR or upload a screenshot");
          err.status = 400;
          throw err;
        }

        if (needsPayment) {
          await assertUtrAvailable(tx, utr);
        }

        const roster = members.map((m, index) => ({
          ign: m.ign,
          bgmiId: String(m.bgmiId).replace(/\s+/g, ""),
          isCaptain: index === 0 || Boolean(m.isCaptain),
          userId: index === 0 ? userId : null,
        }));

        if (!roster.some((m) => m.isCaptain)) {
          roster[0].isCaptain = true;
        }

        const created = await tx.tournamentRegistration.create({
          data: {
            tournamentId,
            userId,
            slotNumber,
            teamName: teamName || members[0]?.ign || "Squad",
            amountPaid: new Decimal(entryFee),
            status: needsPayment ? "PENDING_VERIFICATION" : "CONFIRMED",
            paymentUtr: needsPayment && utr ? utr : null,
            paymentProof: needsPayment && proof ? proof : null,
            members: { create: roster },
          },
          include: { members: true },
        });

        await tx.tournament.update({
          where: { id: tournamentId },
          data: { filledSlots: { increment: 1 } },
        });

        return created;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 15000,
      }
    );

    return Response.json({ registration }, { status: 201 });
  } catch (error) {
    if (error?.code === "P2002") {
      return Response.json(
        { error: "Slot already taken or duplicate registration" },
        { status: 409 }
      );
    }
    return apiError(error);
  }
}
