import prisma from "@/lib/prisma";
import { requireUser, apiError } from "@/lib/session";
import { bgmiProfileSchema } from "@/lib/validations/forms";
import { toNumber } from "@/lib/utils";

/** GET /api/profile */
export async function GET() {
  try {
    const session = await requireUser();
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        bgmiIgn: true,
        bgmiId: true,
        phone: true,
        depositBalance: true,
        winningBalance: true,
        createdAt: true,
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      user: {
        ...user,
        depositBalance: toNumber(user.depositBalance),
        winningBalance: toNumber(user.winningBalance),
      },
    });
  } catch (error) {
    return apiError(error);
  }
}

/** PATCH /api/profile — bind BGMI IGN / ID / phone */
export async function PATCH(request) {
  try {
    const session = await requireUser();
    const body = await request.json();
    const parsed = bgmiProfileSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { bgmiIgn, bgmiId, phone } = parsed.data;

    try {
      const user = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          bgmiIgn,
          bgmiId,
          phone: phone || null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          bgmiIgn: true,
          bgmiId: true,
          phone: true,
        },
      });

      return Response.json({ user });
    } catch (err) {
      if (err?.code === "P2002") {
        return Response.json(
          { error: "BGMI ID or phone is already linked to another account" },
          { status: 409 }
        );
      }
      throw err;
    }
  } catch (error) {
    return apiError(error);
  }
}
