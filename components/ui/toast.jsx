"use client";

import { Sparkles } from "lucide-react";

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 bg-[#101722] border border-[#F59E0B]/50 text-white px-4 py-3 rounded-lg shadow-2xl shadow-orange-950/60 animate-fade-in">
      <Sparkles className="w-4 h-4 text-[#F59E0B]" />
      <span className="text-xs font-semibold tracking-wide">{message}</span>
    </div>
  );
}
