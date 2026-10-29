"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useAuth } from "@/components/providers/auth-provider";

export function Footer() {
  const { isAuthenticated, isPending } = useAuth();

  return (
    <footer className="mt-auto border-t border-[#141C28] bg-[#070B10]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
        <BrandLogo />
        <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
          <Link href="/tournaments" className="hover:text-slate-300">
            Tournaments
          </Link>
          <Link href="/tournaments/create" className="hover:text-slate-300">
            Host
          </Link>
          <Link href="/wallet" className="hover:text-slate-300">
            Wallet
          </Link>
          {!isPending && !isAuthenticated && (
            <Link href="/sign-in" className="hover:text-slate-300">
              Sign in
            </Link>
          )}
          {isAuthenticated && (
            <Link href="/profile" className="hover:text-slate-300">
              Profile
            </Link>
          )}
        </div>
        <p className="text-[11px] text-slate-600">
          © 2026 Nadeflux Esports. Fair play. Instant rooms.
        </p>
      </div>
    </footer>
  );
}
