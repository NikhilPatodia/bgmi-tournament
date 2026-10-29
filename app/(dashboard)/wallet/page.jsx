"use client";

import { useState } from "react";
import { DualBalanceCard } from "@/components/modules/wallet/dual-balance-card";
import { DepositModal } from "@/components/modules/wallet/deposit-modal";
import { TransactionTable } from "@/components/modules/wallet/transaction-table";
import { WithdrawalList } from "@/components/modules/wallet/withdrawal-list";
import { WithdrawalForm } from "@/components/forms/withdrawal-form";
import { Dialog } from "@/components/ui/dialog";
import { Toast } from "@/components/ui/toast";
import { useWallet, useWithdraw } from "@/hooks/use-wallet";

export default function WalletPage() {
  const { data, isLoading, error } = useWallet();
  const withdraw = useWithdraw();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [toast, setToast] = useState("");

  if (isLoading) return <div className="nf-panel h-64 animate-pulse" />;
  if (error) {
    return (
      <div className="nf-panel p-8 text-sm text-red-300">
        {error.message}. Sign in to view your wallet.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#ECA214] font-extrabold uppercase">
            Wallet
          </p>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Dual balance & ledger
          </h1>
        </div>

        <DualBalanceCard
          depositBalance={data.depositBalance}
          winningBalance={data.winningBalance}
          onDeposit={() => setDepositOpen(true)}
          onWithdraw={() => setWithdrawOpen(true)}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">
              Transactions
            </h2>
            <TransactionTable transactions={data.transactions} />
          </section>
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">
              Withdrawals
            </h2>
            <WithdrawalList withdrawals={data.withdrawals} />
          </section>
        </div>
      </div>

      <DepositModal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        onToast={setToast}
      />

      <Dialog
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        title="Withdraw winnings"
      >
        <WithdrawalForm
          winningBalance={data.winningBalance}
          isSubmitting={withdraw.isPending}
          onSubmit={async (values) => {
            try {
              await withdraw.mutateAsync(values);
              setToast("Withdrawal request submitted");
              setWithdrawOpen(false);
            } catch (err) {
              setToast(err.message);
            }
          }}
        />
      </Dialog>

      <Toast message={toast} />
    </>
  );
}
