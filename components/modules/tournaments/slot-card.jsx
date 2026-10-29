"use client";

import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function SlotCard({
  slotNumber,
  registration,
  selected,
  onSelect,
  disabled,
}) {
  const filled = Boolean(registration);

  return (
    <button
      type="button"
      disabled={disabled || filled}
      onClick={() => onSelect?.(slotNumber)}
      className={cn(
        "rounded-lg border p-2.5 text-left transition-all min-h-[72px]",
        filled &&
          registration.status === "PENDING_VERIFICATION" &&
          "border-amber-500/30 bg-amber-500/5 cursor-default",
        filled &&
          registration.status !== "PENDING_VERIFICATION" &&
          "border-cyan-500/30 bg-cyan-500/5 cursor-default",
        !filled &&
          !selected &&
          "border-[#1a2433] bg-[#0a1018] hover:border-amber-500/40 hover:bg-amber-500/5",
        selected && "border-amber-500 bg-amber-500/15 shadow-[0_0_0_1px_rgba(245,158,11,0.35)]",
        disabled && !filled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-black tracking-widest text-slate-500">
          #{String(slotNumber).padStart(2, "0")}
        </span>
        <Users className={cn("h-3 w-3", filled ? "text-cyan-400" : "text-slate-600")} />
      </div>
      {filled ? (
        <p className="text-[11px] font-semibold text-cyan-100 line-clamp-2">
          {registration.status === "PENDING_VERIFICATION"
            ? "Payment pending"
            : registration.teamName || registration.members?.[0]?.ign || "Taken"}
        </p>
      ) : (
        <p className="text-[11px] font-semibold text-slate-400">
          {selected ? "Selected" : "Vacant"}
        </p>
      )}
    </button>
  );
}
