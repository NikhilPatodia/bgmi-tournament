"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatINR } from "@/lib/utils";
import { useReviewWithdrawal } from "@/hooks/use-admin";

export function WithdrawalApprovalCard({ withdrawal, onToast }) {
  const [utr, setUtr] = useState(withdrawal.utrNumber || "");
  const review = useReviewWithdrawal();

  const gpayLink = `upi://pay?pa=${encodeURIComponent(withdrawal.upiId)}&am=${withdrawal.amount}&cu=INR&tn=${encodeURIComponent("Nadeflux payout")}`;

  const run = async (action) => {
    try {
      await review.mutateAsync({
        id: withdrawal.id,
        action,
        utrNumber: utr || undefined,
      });
      onToast?.(`Withdrawal ${action.toLowerCase()}d`);
    } catch (err) {
      onToast?.(err.message);
    }
  };

  return (
    <div className="nf-panel p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white">
            {withdrawal.user?.name || "Player"}
          </p>
          <p className="text-[11px] text-slate-500">{withdrawal.user?.email}</p>
          <p className="text-lg font-black text-amber-300 mt-2">
            {formatINR(withdrawal.amount)}
          </p>
          <p className="text-xs font-mono text-slate-400 mt-1">{withdrawal.upiId}</p>
        </div>
        <a
          href={gpayLink}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 hover:underline"
        >
          Open UPI <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div>
        <Label htmlFor={`utr-${withdrawal.id}`}>UTR / reference</Label>
        <Input
          id={`utr-${withdrawal.id}`}
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          placeholder="Enter bank UTR after payout"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => run("APPROVE")} disabled={review.isPending}>
          Approve
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => run("PROCESS")}
          disabled={review.isPending || !utr}
        >
          Mark paid
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => run("REJECT")}
          disabled={review.isPending}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
