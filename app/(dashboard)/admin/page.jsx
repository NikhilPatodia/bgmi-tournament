"use client";

import Link from "next/link";
import { Pencil, QrCode, Shield, Trophy } from "lucide-react";
import { useRequireAdmin } from "@/hooks/use-admin";

const tools = [
  {
    href: "/admin/tournaments",
    title: "Edit tournaments",
    body: "Change title, schedule, entry fee, room ID, and status. Finalize results from here.",
    icon: Pencil,
  },
  {
    href: "/admin/payments",
    title: "UPI payments",
    body: "Approve or reject match-entry proofs and wallet deposits.",
    icon: QrCode,
  },
  {
    href: "/admin/withdrawals",
    title: "Payouts",
    body: "Send winning-balance withdrawals and record the bank UTR.",
    icon: Shield,
  },
];

export default function AdminHomePage() {
  const { isAdmin, isPending } = useRequireAdmin();
  if (isPending || !isAdmin) return null;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] text-[#ECA214] font-extrabold uppercase">
          Admin
        </p>
        <h1 className="text-2xl font-black text-white tracking-tight">Control room</h1>
        <p className="text-sm text-slate-400 mt-1">
          These tools stay off the public tournament pages.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="nf-panel p-5 hover:border-amber-500/40">
            <tool.icon className="h-5 w-5 text-amber-300" />
            <h2 className="mt-3 text-sm font-bold text-white">{tool.title}</h2>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">{tool.body}</p>
          </Link>
        ))}
      </div>
      <p className="text-xs text-slate-600 inline-flex items-center gap-2">
        <Trophy className="h-3.5 w-3.5" />
        Players still browse and register from the public match page.
      </p>
    </div>
  );
}
