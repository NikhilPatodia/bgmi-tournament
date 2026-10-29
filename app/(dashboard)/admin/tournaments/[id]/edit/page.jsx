"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTournamentSchema } from "@/lib/validations/forms";
import { useTournament } from "@/hooks/use-tournaments";
import { useRequireAdmin, useUpdateTournament } from "@/hooks/use-admin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { formatINR } from "@/lib/utils";

const STATUSES = [
  "UPCOMING",
  "REGISTRATION_CLOSED",
  "CREDENTIALS_RELEASED",
  "LIVE",
  "COMPLETED",
  "CANCELLED",
];

function toLocalInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EditTournamentPage() {
  const { isAdmin, isPending } = useRequireAdmin();
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useTournament(id);
  const update = useUpdateTournament(id);
  const [toast, setToast] = useState("");
  const tournament = data?.tournament;
  const hydratedId = useRef(null);

  const form = useForm({
    resolver: zodResolver(updateTournamentSchema),
    defaultValues: {
      title: "",
      description: "",
      mode: "SQUAD",
      map: "ERANGEL",
      status: "UPCOMING",
      startTime: "",
      releaseTime: "",
      maxSlots: 25,
      entryFee: 0,
      prizeRank1: 0,
      prizeRank2: 0,
      prizeMostKills: 0,
      customRoomId: "",
      customRoomPass: "",
    },
  });

  useEffect(() => {
    if (!tournament?.id || hydratedId.current === tournament.id) return;
    hydratedId.current = tournament.id;
    form.reset({
      title: tournament.title || "",
      description: tournament.description || "",
      mode: tournament.mode,
      map: tournament.map,
      status: tournament.status,
      startTime: toLocalInput(tournament.startTime),
      releaseTime: toLocalInput(tournament.releaseTime),
      maxSlots: tournament.maxSlots,
      entryFee: tournament.entryFee,
      prizeRank1: Number(tournament.prizeBreakdown?.rank1) || 0,
      prizeRank2: Number(tournament.prizeBreakdown?.rank2) || 0,
      prizeMostKills: Number(tournament.prizeBreakdown?.mvp) || 0,
      customRoomId: tournament.customRoomId || "",
      customRoomPass: tournament.customRoomPass || "",
    });
  }, [tournament, form]);

  const prizeRank1 = Number(form.watch("prizeRank1")) || 0;
  const prizeRank2 = Number(form.watch("prizeRank2")) || 0;
  const prizeMostKills = Number(form.watch("prizeMostKills")) || 0;
  const prizeTotal = prizeRank1 + prizeRank2 + prizeMostKills;

  if (isPending || !isAdmin) return null;
  if (isLoading) return <div className="nf-panel h-64 animate-pulse" />;
  if (!tournament) {
    return <div className="nf-panel p-8 text-sm text-red-300">Tournament not found</div>;
  }

  const onSubmit = async (values) => {
    try {
      await update.mutateAsync({
        ...values,
        prizeRank1: Number(values.prizeRank1) || 0,
        prizeRank2: Number(values.prizeRank2) || 0,
        prizeMostKills: Number(values.prizeMostKills) || 0,
        startTime: new Date(values.startTime).toISOString(),
        releaseTime: values.releaseTime ? new Date(values.releaseTime).toISOString() : "",
      });
      setToast("Tournament updated");
      router.push("/admin/tournaments");
    } catch (error) {
      setToast(error.message);
    }
  };

  const onInvalid = (errors) => {
    const first = Object.values(errors)[0];
    setToast(first?.message || "Check the form and save again");
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="max-w-2xl space-y-5">
        <div>
          <Link href="/admin/tournaments" className="text-xs text-slate-500 hover:text-slate-300">
            ← Tournaments
          </Link>
          <h1 className="mt-2 text-2xl font-black text-white">Edit match</h1>
        </div>

        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...form.register("title")} />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea id="description" className="nf-input min-h-[90px]" {...form.register("description")} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mode">Mode</Label>
            <select id="mode" className="nf-input" {...form.register("mode")}>
              {["SOLO", "DUO", "SQUAD"].map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="map">Map</Label>
            <select id="map" className="nf-input" {...form.register("map")}>
              {["ERANGEL", "MIRAMAR", "SANHOK", "VIKENDI"].map((map) => (
                <option key={map} value={map}>{map}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select id="status" className="nf-input" {...form.register("status")}>
              {STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="entryFee">Entry fee (₹)</Label>
            <Input id="entryFee" type="number" {...form.register("entryFee")} />
          </div>
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
          <div>
            <Label htmlFor="maxSlots">Max slots</Label>
            <Input id="maxSlots" type="number" {...form.register("maxSlots")} />
          </div>
          <div>
            <Label htmlFor="startTime">Start time</Label>
            <Input id="startTime" type="datetime-local" {...form.register("startTime")} />
          </div>
          <div>
            <Label htmlFor="releaseTime">Credentials release</Label>
            <Input id="releaseTime" type="datetime-local" {...form.register("releaseTime")} />
          </div>
          <div>
            <Label htmlFor="customRoomId">Room ID</Label>
            <Input id="customRoomId" {...form.register("customRoomId")} />
          </div>
          <div>
            <Label htmlFor="customRoomPass">Room password</Label>
            <Input id="customRoomPass" {...form.register("customRoomPass")} />
          </div>
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Players will see
          </p>
          <p className="mt-1 text-lg font-black text-white">{formatINR(prizeTotal)} prize pool</p>
          <p className="mt-1 text-xs text-slate-400">
            1st {formatINR(prizeRank1)} · 2nd {formatINR(prizeRank2)} · Most kills{" "}
            {formatINR(prizeMostKills)}. Most kills is extra, so 1st place can win both.
          </p>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={update.isPending}>
            {update.isPending ? "Saving…" : "Save changes"}
          </Button>
          <Link
            href={`/admin/tournaments/${id}/finalize`}
            className="inline-flex h-10 items-center rounded-lg border border-[#243044] bg-[#151D28] px-4 text-sm font-bold text-white"
          >
            Enter scores
          </Link>
        </div>
      </form>
      <Toast message={toast} />
    </>
  );
}
