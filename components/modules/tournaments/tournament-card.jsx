"use client";

import Link from "next/link";
import { Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PrizeBreakdown } from "@/components/modules/tournaments/prize-breakdown";
import { formatINR, statusLabel } from "@/lib/utils";

function statusTone(status) {
  if (status === "LIVE") return "live";
  if (status === "UPCOMING") return "accent";
  if (status === "COMPLETED") return "muted";
  if (status === "CANCELLED") return "danger";
  return "default";
}

export function TournamentCard({ tournament }) {
  const fillPct = Math.min(
    100,
    Math.round(((tournament.filledSlots || 0) / (tournament.maxSlots || 1)) * 100)
  );
  const start = tournament.startTime
    ? new Date(tournament.startTime).toLocaleString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      })
    : "TBA";

  return (
    <Link
      href={`/tournaments/${tournament.id}`}
      className="group block nf-panel overflow-hidden transition-transform hover:-translate-y-0.5 hover:border-amber-500/30"
    >
      <div className="relative h-28 bg-gradient-to-br from-amber-950/40 via-yellow-950/20 to-neutral-900/90 border-b border-[#151D28]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.18),transparent_55%)]" />
        <div className="absolute top-3 left-3">
          <Badge tone={statusTone(tournament.status)}>
            {tournament.status === "LIVE" && (
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse-live" />
            )}
            {statusLabel(tournament.status)}
          </Badge>
        </div>
        {tournament.isOfficial && (
          <div className="absolute top-3 right-3">
            <Badge tone="success">Official</Badge>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-1">
            {tournament.title}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Hosted by {tournament.host?.name || "Community"}
          </p>
        </div>

        <PrizeBreakdown tournament={tournament} compact />

        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-cyan-400" />
            {tournament.filledSlots}/{tournament.maxSlots} slots
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {tournament.map} · {tournament.mode}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {start}
          </span>
        </div>

        <div>
          <div className="h-1.5 rounded-full bg-[#151D28] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
              style={{ width: `${fillPct}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">
              {tournament.entryFee > 0
                ? `${formatINR(tournament.entryFee)} entry`
                : "Free entry"}
            </span>
            <span className="font-bold text-amber-300 group-hover:underline">
              View match →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
