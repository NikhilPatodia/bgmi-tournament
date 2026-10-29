"use client";

import { useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_RULES = [
  {
    title: "Eligibility",
    body: "BGMI mobile accounts only. Emulators and rooted devices are banned. Minimum account level 35+.",
  },
  {
    title: "Fair play",
    body: "No teaming, ghosting, or third-party overlays. Proof screenshots may be requested for prize claims.",
  },
  {
    title: "Lobby etiquette",
    body: "Join the custom room at least 5 minutes before start. Late joins may be replaced without refund.",
  },
  {
    title: "Payouts",
    body: "Prizes credit to your Winning Balance after admin finalization. Withdrawals require a valid UPI VPA.",
  },
];

export function MatchRulesAccordion({ rules = DEFAULT_RULES, description }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {description && (
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      )}
      <div className="space-y-2">
        {rules.map((rule, index) => {
          const open = openIndex === index;
          return (
            <div key={rule.title} className="nf-panel overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left"
                onClick={() => setOpenIndex(open ? -1 : index)}
              >
                <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  {rule.title}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-slate-500 transition-transform",
                    open && "rotate-180"
                  )}
                />
              </button>
              {open && (
                <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-[#151D28] pt-3">
                  {rule.body}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
