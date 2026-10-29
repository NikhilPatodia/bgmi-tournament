"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTournamentSchema } from "@/lib/validations/forms";
import { defaultSlotsForMode, formatINR } from "@/lib/utils";
import { buildPrizeBreakdown } from "@/lib/prize";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

const STEPS = ["Identity", "Config", "Review"];

export function CreateTournamentForm({ onSubmit, isSubmitting }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [step, setStep] = useState(0);

  const form = useForm({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: {
      title: "",
      description: "",
      bannerUrl: "",
      mode: "SQUAD",
      map: "ERANGEL",
      startTime: "",
      releaseTime: "",
      maxSlots: 25,
      entryFee: 100,
      platformFeePct: 10,
      prizePreset: "STANDARD",
      prizeRank1: 0,
      prizeRank2: 0,
      prizeMostKills: 0,
      customRoomId: "",
      customRoomPass: "",
    },
  });

  const values = form.watch();
  const financials = useMemo(() => {
    const fee = Number(values.entryFee) || 0;
    const slots = Number(values.maxSlots) || 0;
    const pct = isAdmin ? 0 : Number(values.platformFeePct) || 10;
    const rank1 = Number(values.prizeRank1) || 0;
    const rank2 = Number(values.prizeRank2) || 0;
    const mostKills = Number(values.prizeMostKills) || 0;
    const sponsored = rank1 + rank2 + mostKills;

    if (sponsored > 0) {
      return {
        gross: sponsored,
        platformFee: 0,
        net: sponsored,
        breakdown: { rank1, rank2, rank3: 0, mvp: mostKills },
        sponsored: true,
      };
    }

    const gross = fee * slots;
    const platformFee = Math.round((gross * pct) / 100);
    const net = Math.max(0, gross - platformFee);
    return {
      gross,
      platformFee,
      net,
      breakdown: buildPrizeBreakdown(net, values.prizePreset),
      sponsored: false,
    };
  }, [
    isAdmin,
    values.entryFee,
    values.maxSlots,
    values.platformFeePct,
    values.prizePreset,
    values.prizeRank1,
    values.prizeRank2,
    values.prizeMostKills,
  ]);

  const next = async () => {
    const fields =
      step === 0
        ? ["title", "startTime", "description"]
        : ["mode", "map", "maxSlots", "entryFee", "prizePreset"];
    const ok = await form.trigger(fields);
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((data) => onSubmit(data))}
    >
      <div className="flex gap-2">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={cn(
              "flex-1 rounded-lg border px-3 py-2 text-center text-[11px] font-bold uppercase tracking-wider",
              i === step
                ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                : i < step
                  ? "border-emerald-500/30 text-emerald-300"
                  : "border-[#1a2433] text-slate-500"
            )}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <Label htmlFor="title">Tournament title</Label>
            <Input id="title" {...form.register("title")} placeholder="Weekend Warfare #12" />
            {form.formState.errors.title && (
              <p className="text-[11px] text-red-400 mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="nf-input min-h-[100px]"
              {...form.register("description")}
              placeholder="Lobby format, stream delay, eligibility…"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start time</Label>
              <Input id="startTime" type="datetime-local" {...form.register("startTime")} />
            </div>
            <div>
              <Label htmlFor="releaseTime">Credentials release</Label>
              <Input id="releaseTime" type="datetime-local" {...form.register("releaseTime")} />
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <Label>Mode</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {["SOLO", "DUO", "SQUAD"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    form.setValue("mode", mode);
                    form.setValue("maxSlots", defaultSlotsForMode(mode));
                  }}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs font-bold",
                    values.mode === mode
                      ? "border-amber-500/50 bg-amber-500/15 text-amber-300"
                      : "border-[#1a2433] text-slate-400"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Map</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {["ERANGEL", "MIRAMAR", "SANHOK", "VIKENDI"].map((map) => (
                <button
                  key={map}
                  type="button"
                  onClick={() => form.setValue("map", map)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs font-bold",
                    values.map === map
                      ? "border-amber-500/50 bg-amber-500/15 text-amber-300"
                      : "border-[#1a2433] text-slate-400"
                  )}
                >
                  {map}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maxSlots">Max slots</Label>
              <Input id="maxSlots" type="number" {...form.register("maxSlots")} />
            </div>
            <div>
              <Label htmlFor="entryFee">Entry fee (₹)</Label>
              <Input id="entryFee" type="number" {...form.register("entryFee")} />
            </div>
            <div>
              <Label htmlFor="platformFeePct">Platform fee %</Label>
              <Input
                id="platformFeePct"
                type="number"
                disabled={isAdmin}
                value={isAdmin ? 0 : values.platformFeePct}
                {...(isAdmin ? {} : form.register("platformFeePct"))}
              />
              {isAdmin && (
                <p className="mt-1 text-[11px] text-emerald-300">
                  Admin hosts are not charged a platform fee.
                </p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="prizeRank1">1st prize (₹)</Label>
              <Input id="prizeRank1" type="number" min={0} {...form.register("prizeRank1")} />
            </div>
            <div>
              <Label htmlFor="prizeRank2">2nd prize (₹)</Label>
              <Input id="prizeRank2" type="number" min={0} {...form.register("prizeRank2")} />
            </div>
            <div>
              <Label htmlFor="prizeMostKills">Most kills (₹)</Label>
              <Input id="prizeMostKills" type="number" min={0} {...form.register("prizeMostKills")} />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Set these to pay winners on a free match. Leave them at 0 to split entry fees instead.
            Most kills is extra, so 1st place can also win it.
          </p>

          <div>
            <Label>Prize preset</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {["STANDARD", "WINNER_TAKES_ALL", "CUSTOM"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => form.setValue("prizePreset", preset)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-[11px] font-bold",
                    values.prizePreset === preset
                      ? "border-amber-500/50 bg-amber-500/15 text-amber-300"
                      : "border-[#1a2433] text-slate-400"
                  )}
                >
                  {preset.replaceAll("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customRoomId">Custom room ID (optional)</Label>
              <Input id="customRoomId" {...form.register("customRoomId")} />
            </div>
            <div>
              <Label htmlFor="customRoomPass">Room password (optional)</Label>
              <Input id="customRoomPass" {...form.register("customRoomPass")} />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="nf-panel p-4 space-y-2 text-sm">
            <p className="font-bold text-white text-base">{values.title}</p>
            <p className="text-slate-400 text-xs">
              {values.mode} · {values.map} · {values.maxSlots} slots
            </p>
            <p className="text-slate-400 text-xs">
              Entry {formatINR(values.entryFee)} · Starts{" "}
              {values.startTime
                ? new Date(values.startTime).toLocaleString("en-IN")
                : "—"}
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <Stat label="Gross pool" value={formatINR(financials.gross)} />
            <Stat label="Platform fee" value={formatINR(financials.platformFee)} />
            <Stat label="Net prize" value={formatINR(financials.net)} />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <Stat label="Rank 1" value={formatINR(financials.breakdown.rank1)} />
            <Stat label="Rank 2" value={formatINR(financials.breakdown.rank2)} />
            <Stat label="Most kills" value={formatINR(financials.breakdown.mvp || 0)} />
          </div>
        </div>
      )}

      <div className="flex justify-between gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={next}>
            Continue
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Publishing…" : "Publish tournament"}
          </Button>
        )}
      </div>
    </form>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-[#1a2433] bg-[#0a1018] p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</p>
      <p className="text-sm font-black text-white mt-1">{value}</p>
    </div>
  );
}
