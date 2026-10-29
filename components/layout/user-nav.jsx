"use client";

import Link from "next/link";
import { useState } from "react";
import { LogOut, User, Wallet, Shield, QrCode, Pencil } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useAuth } from "@/components/providers/auth-provider";

export function UserNav({ appearance = "button" }) {
  const { user, isPending, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  if (isPending) {
    return <div className="h-9 w-24 rounded-lg bg-white/5 animate-pulse" />;
  }

  if (!isAuthenticated) {
    if (appearance === "text") {
      return (
        <Link
          href="/sign-in"
          className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2"
        >
          Sign in
        </Link>
      );
    }
    return (
      <Link
        href="/sign-in"
        className="inline-flex h-8 items-center justify-center rounded-lg bg-[#F59E0B] px-3 text-xs font-bold tracking-wide text-black shadow-lg shadow-amber-950/40 hover:bg-[#ECA214]"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-[#1a2433] bg-[#0c121b] px-2 py-1.5 hover:border-amber-500/40 transition-colors"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name || "User"}
            className="h-7 w-7 rounded-md object-cover"
          />
        ) : (
          <div className="h-7 w-7 rounded-md bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold">
            {(user.name || "U").slice(0, 1).toUpperCase()}
          </div>
        )}
        <span className="hidden sm:block text-xs font-semibold text-slate-200 max-w-[100px] truncate">
          {user.name}
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 z-50 w-52 nf-panel py-2 shadow-xl animate-fade-in">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-white/5"
            >
              <User className="h-3.5 w-3.5" /> Profile
            </Link>
            <Link
              href="/wallet"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-white/5"
            >
              <Wallet className="h-3.5 w-3.5" /> Wallet
            </Link>
            {user.role === "ADMIN" && (
              <>
                <Link
                  href="/admin/tournaments"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-white/5"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit tournaments
                </Link>
                <Link
                  href="/admin/payments"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-white/5"
                >
                  <QrCode className="h-3.5 w-3.5" /> UPI payments
                </Link>
                <Link
                  href="/admin/withdrawals"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-white/5"
                >
                  <Shield className="h-3.5 w-3.5" /> Payouts
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={() => signOut({ fetchOptions: { onSuccess: () => (window.location.href = "/") } })}
              className="flex w-full items-center gap-2 px-4 py-2 text-xs text-red-300 hover:bg-white/5"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
