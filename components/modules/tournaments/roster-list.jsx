"use client";

import { Crown } from "lucide-react";

export function RosterList({ members = [], teamName }) {
  if (!members.length) {
    return (
      <p className="text-xs text-slate-500">No roster members to display.</p>
    );
  }

  return (
    <div className="space-y-2">
      {teamName && (
        <p className="text-xs font-bold text-amber-300 tracking-wide uppercase">
          {teamName}
        </p>
      )}
      <ul className="space-y-2">
        {members.map((m) => (
          <li
            key={m.id || `${m.ign}-${m.bgmiId}`}
            className="flex items-center justify-between rounded-lg border border-[#1a2433] bg-[#0a1018] px-3 py-2"
          >
            <div className="flex items-center gap-2">
              {m.isCaptain && <Crown className="h-3.5 w-3.5 text-amber-400" />}
              <div>
                <p className="text-sm font-semibold text-white">{m.ign}</p>
                <p className="text-[11px] text-slate-500 font-mono">{m.bgmiId}</p>
              </div>
            </div>
            {m.isCaptain && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Captain
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
