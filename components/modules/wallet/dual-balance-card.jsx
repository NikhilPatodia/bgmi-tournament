"use client";

import { IndianRupee, Trophy, Wallet } from "lucide-react";
import { formatINR } from "@/lib/utils";

export function DualBalanceCard({
  depositBalance = 0,
  winningBalance = 0,
  onDeposit,
  onWithdraw,
}) {
  const total = Number(depositBalance) + Number(winningBalance);

  return (
    <div className="nf-panel p-5 sm:p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="nf-label">Total wallet</p>
          <p className="text-3xl font-black text-white tracking-tight">
            {formatINR(total)}
          </p>
        </div>
        <div className="rounded-xl bg-amber-500/15 border border-amber-500/30 p-3">
          <Wallet className="h-5 w-5 text-amber-300" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <BalanceTile
          icon={<IndianRupee className="h-4 w-4 text-cyan-300" />}
          label="Deposit balance"
          hint="Entry fees only"
          amount={depositBalance}
        />
        <BalanceTile
          icon={<Trophy className="h-4 w-4 text-amber-300" />}
          label="Winning balance"
          hint="Entry fees + withdrawals"
          amount={winningBalance}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onDeposit}
          className="flex-1 min-w-[140px] h-10 rounded-lg bg-[#F59E0B] text-black text-sm font-bold hover:bg-[#ECA214]"
        >
          Add funds
        </button>
        <button
          type="button"
          onClick={onWithdraw}
          className="flex-1 min-w-[140px] h-10 rounded-lg border border-[#243044] bg-[#151D28] text-white text-sm font-bold hover:bg-[#1a2433]"
        >
          Withdraw winnings
        </button>
      </div>
    </div>
  );
}

function BalanceTile({ icon, label, hint, amount }) {
  return (
    <div className="rounded-xl border border-[#1a2433] bg-[#0a1018] p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
      </div>
      <p className="text-xl font-black text-white">{formatINR(amount)}</p>
      <p className="text-[11px] text-slate-600 mt-1">{hint}</p>
    </div>
  );
}
