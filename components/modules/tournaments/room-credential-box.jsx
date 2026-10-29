"use client";

import { useEffect, useState } from "react";
import { Copy, KeyRound, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTournamentCredentials } from "@/hooks/use-tournaments";

export function RoomCredentialBox({ tournamentId, registered }) {
  const { data, isLoading } = useTournamentCredentials(tournamentId, registered);
  const [copied, setCopied] = useState("");
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!data?.releaseTime || data.ready) return;
    const tick = () => {
      const diff = new Date(data.releaseTime).getTime() - Date.now();
      if (diff <= 0) {
        setCountdown("Unlocking…");
        return;
      }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      setCountdown(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [data?.releaseTime, data?.ready]);

  const copy = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(""), 1600);
    } catch {
      /* ignore */
    }
  };

  if (!registered) {
    return (
      <div className="nf-panel p-5 flex items-start gap-3">
        <Lock className="h-5 w-5 text-slate-500 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-white">Room credentials locked</p>
          <p className="text-xs text-slate-500 mt-1">
            Register for a slot to unlock the custom room ID & password.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="nf-panel p-5 h-28 animate-pulse" />;
  }

  if (!data?.ready) {
    if (!data?.releaseTime) {
      return (
        <div className="nf-panel p-5 flex items-start gap-3">
          <Lock className="h-5 w-5 text-slate-500 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-white">Room credentials locked</p>
            <p className="text-xs text-slate-500 mt-1">
              {data?.message ||
                "Room ID and password appear on this match page before the start time."}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="nf-panel p-5 border-amber-500/20">
        <div className="flex items-center gap-2 text-amber-300 mb-2">
          <KeyRound className="h-4 w-4" />
          <p className="text-sm font-bold">Credentials release countdown</p>
        </div>
        <p className="font-mono text-3xl font-black text-white tracking-widest">
          {countdown || "--:--:--"}
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Room ID and password appear in this box on the match page when the timer ends.
        </p>
      </div>
    );
  }

  if (!data.available) {
    return (
      <div className="nf-panel p-5">
        <p className="text-sm font-bold text-white">Waiting on host</p>
        <p className="text-xs text-slate-500 mt-1">{data.message}</p>
      </div>
    );
  }

  return (
    <div className="nf-panel p-5 space-y-3 border-emerald-500/20">
      <div className="flex items-center gap-2 text-emerald-300">
        <KeyRound className="h-4 w-4" />
        <p className="text-sm font-bold">Custom room ready</p>
      </div>
      <CredentialRow
        label="Room ID"
        value={data.customRoomId}
        copied={copied === "id"}
        onCopy={() => copy(data.customRoomId, "id")}
      />
      <CredentialRow
        label="Password"
        value={data.customRoomPass}
        copied={copied === "pass"}
        onCopy={() => copy(data.customRoomPass, "pass")}
      />
      {data.slotNumber != null && (
        <p className="text-[11px] text-slate-500">
          Your allocated slot: <span className="text-amber-300 font-bold">#{data.slotNumber}</span>
        </p>
      )}
    </div>
  );
}

function CredentialRow({ label, value, copied, onCopy }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[#1a2433] bg-[#0a1018] px-3 py-2.5">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</p>
        <p className="font-mono text-sm font-bold text-white">{value}</p>
      </div>
      <Button size="sm" variant="secondary" onClick={onCopy}>
        <Copy className="h-3.5 w-3.5" />
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}
