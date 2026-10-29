"use client";

import Link from "next/link";
import { useAdminTournaments, useRequireAdmin } from "@/hooks/use-admin";
import { Badge } from "@/components/ui/badge";
import { formatINR, statusLabel } from "@/lib/utils";

export default function AdminTournamentsPage() {
  const { isAdmin, isPending } = useRequireAdmin();
  const { data, isLoading } = useAdminTournaments(isAdmin);

  if (isPending || !isAdmin) return null;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-xs text-slate-500 hover:text-slate-300">
          ← Admin
        </Link>
        <h1 className="mt-2 text-2xl font-black text-white tracking-tight">Tournaments</h1>
        <p className="text-sm text-slate-400 mt-1">
          Edit a match or enter scores. Players do not see these actions.
        </p>
      </div>

      {isLoading && <div className="nf-panel h-40 animate-pulse" />}

      <div className="space-y-3">
        {(data?.tournaments || []).map((tournament) => (
          <div
            key={tournament.id}
            className="nf-panel p-4 flex flex-wrap items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white">{tournament.title}</p>
                <Badge tone={tournament.status === "LIVE" ? "live" : "accent"}>
                  {statusLabel(tournament.status)}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {tournament.map} · {tournament.mode} · {tournament.filledSlots}/
                {tournament.maxSlots} slots · {formatINR(tournament.entryFee)} entry
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <Link
                href={`/admin/tournaments/${tournament.id}/edit`}
                className="rounded-lg bg-[#F59E0B] px-3 py-2 text-black"
              >
                Edit
              </Link>
              <Link
                href={`/admin/tournaments/${tournament.id}/finalize`}
                className="rounded-lg border border-[#243044] bg-[#151D28] px-3 py-2 text-white"
              >
                Finalize
              </Link>
              <Link
                href={`/tournaments/${tournament.id}`}
                className="rounded-lg px-3 py-2 text-slate-400 hover:text-white"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && data?.tournaments?.length === 0 && (
        <div className="nf-panel p-8 text-center text-sm text-slate-500">
          No tournaments yet.
        </div>
      )}
    </div>
  );
}
