"use client";

import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";

function tone(status) {
  if (status === "PROCESSED" || status === "APPROVED") return "success";
  if (status === "PENDING") return "accent";
  return "danger";
}

export function WithdrawalList({ withdrawals = [] }) {
  if (!withdrawals.length) {
    return (
      <div className="nf-panel p-6 text-sm text-slate-500 text-center">
        No withdrawal requests yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {withdrawals.map((w) => (
        <div
          key={w.id}
          className="nf-panel px-4 py-3 flex flex-wrap items-center justify-between gap-3"
        >
          <div>
            <p className="text-sm font-bold text-white">{formatINR(w.amount)}</p>
            <p className="text-[11px] text-slate-500 font-mono">{w.upiId}</p>
          </div>
          <div className="text-right space-y-1">
            <Badge tone={tone(w.status)}>{w.status}</Badge>
            {w.utrNumber && (
              <p className="text-[10px] text-slate-500">UTR {w.utrNumber}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
