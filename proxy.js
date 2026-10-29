import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Next.js 16 proxy (replaces middleware.js).
 * Admin pages never render for non-admins — they are redirected first.
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAuthPage && !isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  let session = null;
  try {
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch {
    session = null;
  }

  if (isAuthPage) {
    if (session?.user?.id) {
      return NextResponse.redirect(new URL("/tournaments", request.url));
    }
    return NextResponse.next();
  }

  if (!session?.user?.id) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("callbackURL", pathname);
    return NextResponse.redirect(signIn);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    if (isAdminApi) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/tournaments", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/sign-in", "/sign-up"],
};
