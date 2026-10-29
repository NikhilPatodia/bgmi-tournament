"use client";

import { useState } from "react";
import { usePendingPayments, useRequireAdmin, useReviewPayment } from "@/hooks/use-admin";
import { ProofViewerDialog } from "@/components/modules/admin/proof-viewer-dialog";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { formatINR } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const { isAdmin, isPending } = useRequireAdmin();
  const { data, isLoading } = usePendingPayments(isAdmin);
  const review = useReviewPayment();
  const [toast, setToast] = useState("");
  const [proof, setProof] = useState("");

  if (isPending || !isAdmin) return null;

  const decide = async (kind, id, action) => {
    try {
      await review.mutateAsync({ kind, id, action });
      setToast(action === "APPROVE" ? "Payment approved" : "Payment rejected");
    } catch (error) {
      setToast(error.message);
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#ECA214] font-extrabold uppercase">
            Admin
          </p>
          <h1 className="text-2xl font-black text-white tracking-tight">UPI payment checks</h1>
          <p className="text-sm text-slate-400 mt-1">
            Match the UTR or screenshot against your UPI app, then approve or reject.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">Match entries</h2>
          {isLoading && <div className="nf-panel h-24 animate-pulse" />}
          {(data?.entries || []).map((entry) => (
            <PaymentCard
              key={entry.id}
              title={entry.teamName || entry.user?.name}
              subtitle={`${entry.tournament?.title} · slot #${entry.slotNumber}`}
              amount={entry.amountPaid}
              utr={entry.paymentUtr}
              proof={entry.paymentProof}
              onProof={setProof}
              onApprove={() => decide("registrations", entry.id, "APPROVE")}
              onReject={() => decide("registrations", entry.id, "REJECT")}
              busy={review.isPending}
            />
          ))}
          {!isLoading && !data?.entries?.length && (
            <Empty label="No match payments waiting." />
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">Wallet deposits</h2>
          {(data?.deposits || []).map((deposit) => (
            <PaymentCard
              key={deposit.id}
              title={deposit.user?.name}
              subtitle={deposit.user?.email}
              amount={deposit.amount}
              utr={deposit.utrNumber}
              proof={deposit.proofScreenshot}
              onProof={setProof}
              onApprove={() => decide("deposits", deposit.id, "APPROVE")}
              onReject={() => decide("deposits", deposit.id, "REJECT")}
              busy={review.isPending}
            />
          ))}
          {!isLoading && !data?.deposits?.length && (
            <Empty label="No wallet deposits waiting." />
          )}
        </section>
      </div>
      <ProofViewerDialog open={Boolean(proof)} src={proof} onClose={() => setProof("")} title="UPI proof" />
      <Toast message={toast} />
    </>
  );
}

function PaymentCard({ title, subtitle, amount, utr, proof, onProof, onApprove, onReject, busy }) {
  return (
    <div className="nf-panel p-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="text-[11px] text-slate-500">{subtitle}</p>
        <p className="mt-1 text-sm font-black text-amber-300">{formatINR(amount)}</p>
        <p className="font-mono text-xs text-slate-300">{utr || "No UTR — check the screenshot"}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {proof && (
          <Button size="sm" variant="secondary" onClick={() => onProof(proof)}>
            Screenshot
          </Button>
        )}
        <Button size="sm" disabled={busy} onClick={onApprove}>
          Approve
        </Button>
        <Button size="sm" variant="danger" disabled={busy} onClick={onReject}>
          Reject
        </Button>
      </div>
    </div>
  );
}

function Empty({ label }) {
  return <div className="nf-panel p-6 text-sm text-slate-500 text-center">{label}</div>;
}
