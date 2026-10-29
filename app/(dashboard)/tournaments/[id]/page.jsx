"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Clock, MapPin, Trophy, Users } from "lucide-react";
import { useTournament } from "@/hooks/use-tournaments";
import { SlotGrid } from "@/components/modules/tournaments/slot-grid";
import { RoomCredentialBox } from "@/components/modules/tournaments/room-credential-box";
import { PrizeBreakdown } from "@/components/modules/tournaments/prize-breakdown";
import { MatchResults } from "@/components/modules/tournaments/match-results";
import { RosterList } from "@/components/modules/tournaments/roster-list";
import { MatchRulesAccordion } from "@/components/modules/tournaments/match-rules-accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR, statusLabel } from "@/lib/utils";

export default function TournamentDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useTournament(id);
  const tournament = data?.tournament;

  if (isLoading) {
    return <div className="nf-panel h-96 animate-pulse" />;
  }

  if (error || !tournament) {
    return (
      <div className="nf-panel p-8 text-sm text-red-300">
        {error?.message || "Tournament not found"}
      </div>
    );
  }

  const myReg = tournament.myRegistration;
  const myFullReg = tournament.registrations?.find((r) => r.id === myReg?.id);

  return (
    <div className="space-y-6">
      <div className="nf-panel overflow-hidden">
        <div className="relative h-36 sm:h-44 bg-gradient-to-br from-amber-950/50 via-neutral-900 to-[#070B10]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(245,158,11,0.2),transparent_50%)]" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <Badge tone={tournament.status === "LIVE" ? "live" : "accent"}>
                {statusLabel(tournament.status)}
              </Badge>
              <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
                {tournament.title}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Hosted by {tournament.host?.name}
              </p>
            </div>
            {!myReg && tournament.status === "UPCOMING" && (
              <Link href={`/tournaments/${tournament.id}/register`}>
                <Button>Register squad</Button>
              </Link>
            )}
            {myReg && (
              <Badge tone={myReg.status === "PENDING_VERIFICATION" ? "accent" : "success"}>
                {myReg.status === "PENDING_VERIFICATION"
                  ? `Slot #${myReg.slotNumber} awaiting UPI approval`
                  : `Slot #${myReg.slotNumber} locked`}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-3 p-4 border-t border-[#151D28]">
          <Meta
            icon={<Trophy className="h-4 w-4 text-amber-400" />}
            label="Prize pool"
            value={formatINR(tournament.netPrizePool)}
          />
          <Meta
            icon={<Users className="h-4 w-4 text-cyan-400" />}
            label="Slots"
            value={`${tournament.filledSlots}/${tournament.maxSlots}`}
          />
          <Meta
            icon={<MapPin className="h-4 w-4" />}
            label="Format"
            value={`${tournament.map} · ${tournament.mode}`}
          />
          <Meta
            icon={<Clock className="h-4 w-4" />}
            label="Starts"
            value={new Date(tournament.startTime).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "numeric",
              minute: "2-digit",
            })}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MatchResults tournament={tournament} myRegistrationId={myReg?.id} />

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">
              Slot grid
            </h2>
            <SlotGrid
              maxSlots={tournament.maxSlots}
              registrations={tournament.registrations}
              locked
            />
          </section>

          {myFullReg && (
            <section className="nf-panel p-5 space-y-3">
              <h2 className="text-sm font-bold text-white">Your roster</h2>
              <RosterList
                teamName={myFullReg.teamName}
                members={myFullReg.members}
              />
            </section>
          )}

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">
              Rules
            </h2>
            <MatchRulesAccordion description={tournament.description} />
          </section>
        </div>

        <div className="space-y-4">
          <RoomCredentialBox
            tournamentId={tournament.id}
            registered={Boolean(myReg)}
          />
          <PrizeBreakdown tournament={tournament} />
          <div className="nf-panel p-5 space-y-2 text-xs text-slate-400">
            <p>
              Entry fee:{" "}
              <span className="text-white font-bold">
                {tournament.entryFee > 0
                  ? formatINR(tournament.entryFee)
                  : "Free"}
              </span>
            </p>
            <p>Entry is paid by UPI QR. The slot stays on hold until an admin matches your UTR.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({ icon, label, value }) {
  return (
    <div className="rounded-lg border border-[#1a2433] bg-[#0a1018] p-3">
      <div className="flex items-center gap-1.5 text-slate-500 mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  );
}
