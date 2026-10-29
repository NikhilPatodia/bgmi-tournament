"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useTournaments } from "@/hooks/use-tournaments";
import { TournamentCard } from "@/components/modules/tournaments/tournament-card";
import { TournamentFilters } from "@/components/modules/tournaments/tournament-filters";
import { Input } from "@/components/ui/input";

export default function TournamentsPage() {
  const [filters, setFilters] = useState({ status: "UPCOMING", map: "", mode: "", q: "" });
  const { data, isLoading, error } = useTournaments(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#ECA214] font-extrabold uppercase">
            Arena
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Browse tournaments
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Filter by status, map, and mode — register before slots fill.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <Input
            className="pl-9"
            placeholder="Search tournaments"
            value={filters.q}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          />
        </div>
      </div>

      <TournamentFilters filters={filters} onChange={setFilters} />

      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="nf-panel h-64 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="nf-panel p-6 text-sm text-red-300">
          {error.message}
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.tournaments || []).map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      )}

      {!isLoading && data?.tournaments?.length === 0 && (
        <div className="nf-panel p-10 text-center text-sm text-slate-500">
          No tournaments match these filters. Host one to fill the lobby.
        </div>
      )}
    </div>
  );
}
