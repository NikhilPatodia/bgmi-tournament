"use client";

import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";

function typeTone(type) {
  if (type === "DEPOSIT" || type === "PRIZE_PAYOUT" || type === "WITHDRAWAL_REFUND") {
    return "success";
  }
  if (type === "ENTRY_FEE" || type === "WITHDRAWAL_REQUEST") return "accent";
  if (type === "FAILED") return "danger";
  return "muted";
}

function statusTone(status) {
  if (status === "SUCCESS") return "success";
  if (status === "PENDING") return "accent";
  return "danger";
}

export function TransactionTable({ transactions = [] }) {
  if (!transactions.length) {
    return (
      <div className="nf-panel p-8 text-center text-sm text-slate-500">
        No wallet activity yet.
      </div>
    );
  }

  return (
    <div className="nf-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0a1018] text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 font-bold">When</th>
              <th className="px-4 py-3 font-bold">Type</th>
              <th className="px-4 py-3 font-bold">Amount</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Note</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t border-[#151D28]">
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                  {new Date(tx.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={typeTone(tx.type)}>{tx.type.replaceAll("_", " ")}</Badge>
                </td>
                <td
                  className={`px-4 py-3 font-bold whitespace-nowrap ${
                    Number(tx.amount) >= 0 ? "text-emerald-300" : "text-red-300"
                  }`}
                >
                  {Number(tx.amount) >= 0 ? "+" : ""}
                  {formatINR(tx.amount)}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone(tx.status)}>{tx.status}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-500 max-w-[220px] truncate">
                  {tx.note || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
