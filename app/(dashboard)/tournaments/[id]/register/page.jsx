"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTournament, useRegisterTournament } from "@/hooks/use-tournaments";
import { useProfile } from "@/hooks/use-wallet";
import { SlotGrid } from "@/components/modules/tournaments/slot-grid";
import { TournamentRegistrationForm } from "@/components/forms/tournament-registration-form";
import { Toast } from "@/components/ui/toast";
import { formatINR } from "@/lib/utils";

export default function RegisterPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, error } = useTournament(id);
  const { data: profileData } = useProfile();
  const register = useRegisterTournament(id);
  const [slotNumber, setSlotNumber] = useState(null);
  const [toast, setToast] = useState("");

  const tournament = data?.tournament;

  if (isLoading) return <div className="nf-panel h-96 animate-pulse" />;
  if (error || !tournament) {
    return (
      <div className="nf-panel p-8 text-sm text-red-300">
        {error?.message || "Tournament not found"}
      </div>
    );
  }

  if (tournament.myRegistration) {
    return (
      <div className="nf-panel p-8 space-y-3">
        <h1 className="text-xl font-black text-white">Already registered</h1>
        <p className="text-sm text-slate-400">
          {tournament.myRegistration.status === "PENDING_VERIFICATION"
            ? `Slot #${tournament.myRegistration.slotNumber} is held until your UPI payment is approved.`
            : `You hold slot #${tournament.myRegistration.slotNumber}.`}
        </p>
        <Link
          href={`/tournaments/${tournament.id}`}
          className="text-amber-300 text-sm font-bold hover:underline"
        >
          Back to match →
        </Link>
      </div>
    );
  }

  const onSubmit = async (values) => {
    try {
      await register.mutateAsync(values);
      setToast(
        tournament.entryFee > 0
          ? "Slot held. An admin will confirm it after checking your UTR."
          : "Slot locked — see you in the lobby."
      );
      router.push(`/tournaments/${tournament.id}`);
    } catch (err) {
      setToast(err.message || "Registration failed");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <Link
            href={`/tournaments/${tournament.id}`}
            className="text-xs text-slate-500 hover:text-slate-300"
          >
            ← Back to match
          </Link>
          <h1 className="mt-2 text-2xl font-black text-white tracking-tight">
            Register · {tournament.title}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Entry {tournament.entryFee > 0 ? formatINR(tournament.entryFee) : "Free"} ·{" "}
            {tournament.mode} · pick a vacant slot
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">
              Choose slot
            </h2>
            <SlotGrid
              maxSlots={tournament.maxSlots}
              registrations={tournament.registrations}
              selectedSlot={slotNumber}
              onSelect={setSlotNumber}
            />
          </section>

          <section className="nf-panel p-5">
            {!slotNumber ? (
              <p className="text-sm text-slate-500">
                Select a vacant slot on the grid to continue roster entry.
              </p>
            ) : (
              <TournamentRegistrationForm
                tournament={tournament}
                slotNumber={slotNumber}
                defaultCaptain={profileData?.user}
                onSubmit={onSubmit}
                isSubmitting={register.isPending}
              />
            )}
          </section>
        </div>
      </div>
      <Toast message={toast} />
    </>
  );
}
