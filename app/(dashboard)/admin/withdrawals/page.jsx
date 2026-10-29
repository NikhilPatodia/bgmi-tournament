"use client";

import { useState } from "react";
import { useAdminWithdrawals, useRequireAdmin } from "@/hooks/use-admin";
import { WithdrawalApprovalCard } from "@/components/modules/admin/withdrawal-approval-card";
import { Toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const TABS = ["PENDING", "APPROVED", "PROCESSED", "REJECTED", "ALL"];

export default function AdminWithdrawalsPage() {
  const { isAdmin, isPending: authPending } = useRequireAdmin();
  const [status, setStatus] = useState("PENDING");
  const { data, isLoading, error } = useAdminWithdrawals(status, isAdmin);
  const [toast, setToast] = useState("");

  if (authPending || !isAdmin) return null;

  return (
    <>
      <div className="space-y-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#ECA214] font-extrabold uppercase">
            Admin
          </p>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Withdrawal approvals
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review UPI payouts, paste UTR, or reject with refund.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatus(tab)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider",
                status === tab
                  ? "border-amber-500/50 bg-amber-500/15 text-amber-300"
                  : "border-[#1a2433] text-slate-400"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {isLoading && <div className="nf-panel h-40 animate-pulse" />}
        {error && (
          <div className="nf-panel p-6 text-sm text-red-300">{error.message}</div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {(data?.withdrawals || []).map((w) => (
            <WithdrawalApprovalCard
              key={w.id}
              withdrawal={w}
              onToast={setToast}
            />
          ))}
        </div>

        {!isLoading && data?.withdrawals?.length === 0 && (
          <div className="nf-panel p-8 text-center text-sm text-slate-500">
            No withdrawals in this queue.
          </div>
        )}
      </div>
      <Toast message={toast} />
    </>
  );
}
