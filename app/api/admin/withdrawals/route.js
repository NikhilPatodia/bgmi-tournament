import prisma from "@/lib/prisma";
import { requireAdmin, apiError } from "@/lib/session";
import { toNumber } from "@/lib/utils";

/** GET /api/admin/withdrawals — list pending/all payouts */
export async function GET(request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING";

    const withdrawals = await prisma.withdrawalRequest.findMany({
      where: status === "ALL" ? {} : { status },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            bgmiIgn: true,
            image: true,
          },
        },
      },
      take: 100,
    });

    return Response.json({
      withdrawals: withdrawals.map((w) => ({
        ...w,
        amount: toNumber(w.amount),
      })),
    });
  } catch (error) {
    console.log("error", error);
    return apiError(error);
  }
}
