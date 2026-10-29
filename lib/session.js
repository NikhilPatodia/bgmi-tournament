import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/** Resolve Better Auth session from request headers. */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/** Require an authenticated user; throws Response-like error payload. */
export async function requireUser() {
  const session = await getSession();
  if (!session?.user?.id) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
  return session;
}

/** Require ADMIN role. */
export async function requireAdmin() {
  const session = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, email: true, name: true },
  });

  if (!user || user.role !== "ADMIN") {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }

  return { session, user };
}

/** JSON error helper for route handlers. */
export function apiError(error, fallback = "Internal server error") {
  const candidate = Number(error?.status);
  const status =
    Number.isInteger(candidate) && candidate >= 200 && candidate <= 599
      ? candidate
      : 500;
  const message = status < 500 && error?.message ? error.message : fallback;
  return Response.json({ error: message }, { status });
}
