"use client";

import { Dialog } from "@/components/ui/dialog";

export function ProofViewerDialog({ open, onClose, src, title = "Match proof" }) {
  return (
    <Dialog open={open} onClose={onClose} title={title} className="max-w-4xl">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="Score proof screenshot"
          className="w-full max-h-[70vh] object-contain rounded-lg border border-[#1a2433] bg-black"
        />
      ) : (
        <p className="text-sm text-slate-500">No proof screenshot attached.</p>
      )}
    </Dialog>
  );
}
