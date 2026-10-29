"use client";

import { cn } from "@/lib/utils";

const statuses = [
  { value: "", label: "All" },
  { value: "UPCOMING", label: "Upcoming" },
  { value: "LIVE", label: "Live" },
  { value: "COMPLETED", label: "Completed" },
];

const maps = ["", "ERANGEL", "MIRAMAR", "SANHOK", "VIKENDI"];
const modes = ["", "SOLO", "DUO", "SQUAD"];

export function TournamentFilters({ filters, onChange }) {
  return (
    <div className="space-y-3">
      <FilterRow
        label="Status"
        options={statuses}
        value={filters.status || ""}
        onChange={(status) => onChange({ ...filters, status })}
      />
      <FilterRow
        label="Map"
        options={maps.map((m) => ({ value: m, label: m || "All maps" }))}
        value={filters.map || ""}
        onChange={(map) => onChange({ ...filters, map })}
      />
      <FilterRow
        label="Mode"
        options={modes.map((m) => ({ value: m, label: m || "All modes" }))}
        value={filters.mode || ""}
        onChange={(mode) => onChange({ ...filters, mode })}
      />
    </div>
  );
}

function FilterRow({ label, options, value, onChange }) {
  return (
    <div>
      <p className="nf-label mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value || "all"}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors",
              value === opt.value
                ? "border-amber-500/50 bg-amber-500/15 text-amber-300"
                : "border-[#1a2433] bg-[#0c121b] text-slate-400 hover:text-slate-200"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
