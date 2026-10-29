"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTournament } from "@/hooks/use-tournaments";
import { useFinalizeTournament, useRequireAdmin } from "@/hooks/use-admin";
import { ScoreEntryTable } from "@/components/modules/admin/score-entry-table";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";

export default function FinalizeTournamentPage() {
  const { isAdmin, isPending: authPending } = useRequireAdmin();
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, error } = useTournament(id);
  const finalize = useFinalizeTournament(id);
  const [rows, setRows] = useState([]);
  const [toast, setToast] = useState("");

  const tournament = data?.tournament;

  useEffect(() => {
    if (!tournament?.registrations) return;
    setRows(
      tournament.registrations.map((reg, index) => ({
        registrationId: reg.id,
        rank: index + 1,
        kills: 0,
        placementPoints: 0,
        killPoints: 0,
        isMvp: false,
        proofScreenshot: "",
      }))
    );
  }, [tournament?.registrations]);

  if (authPending || !isAdmin) return null;
  if (isLoading) return <div className="nf-panel h-64 animate-pulse" />;
  if (error || !tournament) {
    return (
      <div className="nf-panel p-8 text-sm text-red-300">
        {error?.message || "Tournament not found"}
      </div>
    );
  }

  const onFinalize = async () => {
    try {
      await finalize.mutateAsync({ results: rows });
      setToast("Results published & prizes credited");
      router.push(`/tournaments/${id}`);
    } catch (err) {
      setToast(err.message);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#ECA214] font-extrabold uppercase">
              Admin finalize
            </p>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {tournament.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Enter rank, kills, MVP — live prize preview before payout.
            </p>
          </div>
          <Button onClick={onFinalize} disabled={finalize.isPending || !rows.length}>
            {finalize.isPending ? "Finalizing…" : "Publish results & pay pool"}
          </Button>
        </div>

        <ScoreEntryTable
          registrations={tournament.registrations}
          tournament={tournament}
          rows={rows}
          onChange={setRows}
        />
      </div>
      <Toast message={toast} />
    </>
  );
}
