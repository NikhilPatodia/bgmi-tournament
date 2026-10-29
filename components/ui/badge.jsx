"use client";

import { cn } from "@/lib/utils";

const tones = {
  default: "bg-slate-800 text-slate-200 border-slate-700",
  accent: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  live: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  danger: "bg-red-500/15 text-red-300 border-red-500/40",
  muted: "bg-white/5 text-slate-400 border-white/10",
};

export function Badge({ className, tone = "default", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
