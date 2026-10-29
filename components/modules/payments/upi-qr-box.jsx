"use client";

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { buildUpiUrl } from "@/lib/upi-link";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function UpiQrBox({ amount, note }) {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState("");
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/payments/upi")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "UPI is not configured");
        if (!cancelled) setConfig(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const upiUrl =
    config && amount
      ? buildUpiUrl({
          upiId: config.upiId,
          payeeName: config.payeeName,
          amount,
          note: note || "Nadeflux payment",
        })
      : "";

  useEffect(() => {
    if (!upiUrl) return;
    let cancelled = false;
    import("qrcode").then((QR) => {
      QR.toDataURL(upiUrl, { width: 280, margin: 1, color: { dark: "#0b0f14", light: "#ffffff" } })
        .then((url) => {
          if (!cancelled) setQr(url);
        })
        .catch(() => {
          if (!cancelled) setError("Could not render the QR code");
        });
    });
    return () => {
      cancelled = true;
    };
  }, [upiUrl]);

  const copy = async () => {
    if (!config?.upiId) return;
    await navigator.clipboard.writeText(config.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (error) {
    return <p className="text-xs text-red-300">{error}</p>;
  }

  if (!config) {
    return <div className="h-40 rounded-lg bg-[#0a1018] animate-pulse" />;
  }

  return (
    <div className="rounded-xl border border-amber-500/30 bg-[#0a1018] p-4 space-y-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
          Pay {formatINR(amount)} on UPI
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Scan the QR or pay {config.upiId}. Then submit the UTR or a screenshot.
        </p>
      </div>
      {qr ? (
        <img src={qr} alt="UPI payment QR" className="mx-auto h-44 w-44 rounded-lg bg-white p-2" />
      ) : (
        <div className="mx-auto h-44 w-44 rounded-lg bg-white/5 animate-pulse" />
      )}
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-sm font-bold text-white">{config.upiId}</p>
        <Button type="button" size="sm" variant="secondary" onClick={copy}>
          <Copy className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <a href={upiUrl} className="block text-center text-xs font-bold text-cyan-300 hover:underline">
        Open in GPay / PhonePe
      </a>
    </div>
  );
}
