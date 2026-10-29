import Link from "next/link";
import { explainPrize } from "@/lib/prize";
import { formatINR } from "@/lib/utils";

export function MatchResults({ tournament, myRegistrationId }) {
  const results = tournament?.results || [];
  if (tournament?.status !== "COMPLETED" && results.length === 0) return null;

  const mine = results.find((result) => result.registrationId === myRegistrationId);

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold text-white tracking-wide uppercase">Results</h2>
      {mine && <YourPayout tournament={tournament} result={mine} />}
      <div className="nf-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a1018] text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-bold">Rank</th>
                <th className="px-4 py-3 font-bold">Player</th>
                <th className="px-4 py-3 font-bold">Kills</th>
                <th className="px-4 py-3 font-bold">Won</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => {
                const isMine = result.registrationId === myRegistrationId;
                return (
                  <tr
                    key={result.id}
                    className={`border-t border-[#151D28] ${isMine ? "bg-amber-500/10" : ""}`}
                  >
                    <td className="px-4 py-3 font-black text-white">#{result.rank}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {result.registration?.teamName || `Slot #${result.registration?.slotNumber}`}
                      {result.isMvp && (
                        <span className="ml-2 text-[10px] font-bold uppercase text-amber-300">
                          Most kills
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{result.kills}</td>
                    <td className="px-4 py-3 font-bold text-emerald-300">
                      {formatINR(result.prizeWon)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function YourPayout({ tournament, result }) {
  const explained = explainPrize(tournament, {
    rank: result.rank,
    kills: result.kills,
    isMvp: result.isMvp,
  });
  const credited = Number(result.prizeWon) || explained.total;

  return (
    <div className="nf-panel p-5 space-y-3 border-emerald-500/20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            Your result
          </p>
          <p className="text-lg font-black text-white">
            Rank #{result.rank} · {result.kills} kills
          </p>
        </div>
        <p className="text-2xl font-black text-emerald-300">{formatINR(credited)}</p>
      </div>
      {explained.parts.length > 0 ? (
        <ul className="space-y-1 text-xs text-slate-400">
          {explained.parts.map((part) => (
            <li key={part.label} className="flex justify-between gap-3">
              <span>{part.label}</span>
              <span className="font-bold text-white">{formatINR(part.amount)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-slate-500">This finish did not pay a placement or kill bonus.</p>
      )}
      <p className="text-[11px] text-slate-500">
        {result.isMvp
          ? "You had the most kills, so that bonus was added on top of your placement."
          : "Kills are listed for the scoreboard. Cash for kills is only the most-kills bonus, and only the top player receives it."}{" "}
        The total was added to your winning balance.{" "}
        <Link href="/wallet" className="font-bold text-amber-300 hover:underline">
          Open wallet
        </Link>
      </p>
    </div>
  );
}
