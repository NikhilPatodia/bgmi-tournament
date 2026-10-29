"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpiQrBox } from "@/components/modules/payments/upi-qr-box";
import { useDeposit } from "@/hooks/use-wallet";
import { cn } from "@/lib/utils";

const PRESETS = [50, 100, 200, 500, 1000];

export function DepositModal({ open, onClose, onToast }) {
  const [amount, setAmount] = useState(100);
  const [utrNumber, setUtrNumber] = useState("");
  const [proofScreenshot, setProofScreenshot] = useState("");
  const deposit = useDeposit();

  const submit = async () => {
    try {
      await deposit.mutateAsync({
        amount: Number(amount),
        utrNumber,
        proofScreenshot,
      });
      onToast?.("Deposit submitted. Your balance updates after admin approval.");
      setUtrNumber("");
      setProofScreenshot("");
      onClose?.();
    } catch (err) {
      onToast?.(err.message || "Deposit failed");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Add deposit funds" className="max-w-md">
      <div className="space-y-4">
        <div>
          <Label>Quick amounts</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-bold",
                  Number(amount) === preset
                    ? "border-amber-500/50 bg-amber-500/15 text-amber-300"
                    : "border-[#1a2433] text-slate-400"
                )}
              >
                ₹{preset}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="deposit-amount">Amount (₹)</Label>
          <Input
            id="deposit-amount"
            type="number"
            min={50}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <UpiQrBox amount={Number(amount) || 0} note="Nadeflux wallet deposit" />

        <div>
          <Label htmlFor="deposit-utr">UTR / transaction ID</Label>
          <Input
            id="deposit-utr"
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value)}
            placeholder="12-digit UTR"
          />
        </div>
        <div>
          <Label htmlFor="deposit-proof">Screenshot</Label>
          <Input
            id="deposit-proof"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              if (file.size > 1_500_000) {
                onToast?.("Screenshot must be under 1.5 MB");
                return;
              }
              const reader = new FileReader();
              reader.onload = () => setProofScreenshot(String(reader.result || ""));
              reader.readAsDataURL(file);
            }}
          />
        </div>

        <Button className="w-full" onClick={submit} disabled={deposit.isPending}>
          {deposit.isPending ? "Submitting…" : "Submit for approval"}
        </Button>
      </div>
    </Dialog>
  );
}
