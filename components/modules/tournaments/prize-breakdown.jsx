import { listPrizePayouts } from "@/lib/prize";
import { formatINR } from "@/lib/utils";

/** Compact list of every amount a player can win. */
export function PrizeBreakdown({ tournament, compact = false }) {
  const payouts = listPrizePayouts(tournament?.prizeBreakdown);
  const pool = formatINR(tournament?.netPrizePool);

  if (compact) {
    return (
      <div className="rounded-lg border border-[#1a2433] bg-[#0a1018] px-3 py-2 space-y-2">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="font-bold uppercase tracking-wider text-slate-500">Prize pool</span>
          <span className="font-black text-amber-300">{pool}</span>
        </div>
        {payouts.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {payouts.map((row) => (
              <li
                key={row.key}
                className="rounded-md border border-[#243044] bg-[#070B10] px-2 py-1 text-[10px] text-slate-400"
              >
                {row.label}{" "}
                <span className="font-bold text-white">{formatINR(row.amount)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[10px] text-slate-500">No placement prizes set yet.</p>
        )}
      </div>
    );
  }

  return (
    <div className="nf-panel p-5 space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Prize pool
          </p>
          <p className="text-xl font-black text-white">{pool}</p>
        </div>
        <p className="text-[11px] text-slate-500 text-right max-w-[14rem]">
          Most kills is extra. 1st place can win both.
        </p>
      </div>
      {payouts.length > 0 ? (
        <ul className="grid grid-cols-2 gap-2">
          {payouts.map((row) => (
            <li key={row.key} className="rounded-lg border border-[#1a2433] bg-[#0a1018] p-3">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                {row.label}
              </p>
              <p className="mt-1 text-sm font-black text-amber-300">{formatINR(row.amount)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-slate-500">Prizes have not been set for this match.</p>
      )}
    </div>
  );
}
