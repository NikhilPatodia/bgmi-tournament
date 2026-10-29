"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateTournamentForm } from "@/components/forms/create-tournament-form";
import { useCreateTournament } from "@/hooks/use-tournaments";
import { Toast } from "@/components/ui/toast";

export default function CreateTournamentPage() {
  const router = useRouter();
  const create = useCreateTournament();
  const [toast, setToast] = useState("");

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        startTime: new Date(values.startTime).toISOString(),
        releaseTime: values.releaseTime
          ? new Date(values.releaseTime).toISOString()
          : undefined,
        bannerUrl: values.bannerUrl || undefined,
      };
      const res = await create.mutateAsync(payload);
      setToast("Tournament published");
      router.push(`/tournaments/${res.tournament.id}`);
    } catch (err) {
      setToast(err.message || "Failed to create tournament");
    }
  };

  return (
    <>
      <div className="max-w-3xl space-y-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#ECA214] font-extrabold uppercase">
            Host
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create tournament
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Multi-step wizard for match identity, lobby config, and prize preview.
          </p>
        </div>
        <div className="nf-panel p-5 sm:p-6">
          <CreateTournamentForm
            onSubmit={onSubmit}
            isSubmitting={create.isPending}
          />
        </div>
      </div>
      <Toast message={toast} />
    </>
  );
}
