"use client";

import { Input } from "@/components/ui/input";
import { computePrizeWon } from "@/lib/prize";
import { formatINR } from "@/lib/utils";

export function ScoreEntryTable({
  registrations = [],
  tournament,
  rows,
  onChange,
}) {
  const updateRow = (registrationId, patch) => {
    onChange(
      rows.map((row) =>
        row.registrationId === registrationId ? { ...row, ...patch } : row
      )
    );
  };

  return (
    <div className="nf-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0a1018] text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-3 py-3">Team</th>
              <th className="px-3 py-3">Rank</th>
              <th className="px-3 py-3">Kills</th>
              <th className="px-3 py-3">Place pts</th>
              <th className="px-3 py-3">MVP</th>
              <th className="px-3 py-3">Prize preview</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => {
              const row = rows.find((r) => r.registrationId === reg.id) || {
                registrationId: reg.id,
                rank: reg.slotNumber,
                kills: 0,
                placementPoints: 0,
                isMvp: false,
              };
              const preview = computePrizeWon(tournament, row);
              return (
                <tr key={reg.id} className="border-t border-[#151D28]">
                  <td className="px-3 py-2.5">
                    <p className="font-semibold text-white">
                      {reg.teamName || `Slot #${reg.slotNumber}`}
                    </p>
                    <p className="text-[10px] text-slate-500">Slot #{reg.slotNumber}</p>
                  </td>
                  <td className="px-3 py-2.5 w-20">
                    <Input
                      type="number"
                      min={1}
                      value={row.rank}
                      onChange={(e) =>
                        updateRow(reg.id, { rank: Number(e.target.value) })
                      }
                    />
                  </td>
                  <td className="px-3 py-2.5 w-20">
                    <Input
                      type="number"
                      min={0}
                      value={row.kills}
                      onChange={(e) =>
                        updateRow(reg.id, { kills: Number(e.target.value) })
                      }
                    />
                  </td>
                  <td className="px-3 py-2.5 w-24">
                    <Input
                      type="number"
                      min={0}
                      value={row.placementPoints}
                      onChange={(e) =>
                        updateRow(reg.id, {
                          placementPoints: Number(e.target.value),
                        })
                      }
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={Boolean(row.isMvp)}
                      onChange={(e) =>
                        updateRow(reg.id, { isMvp: e.target.checked })
                      }
                      className="h-4 w-4 accent-amber-500"
                    />
                  </td>
                  <td className="px-3 py-2.5 font-bold text-amber-300 whitespace-nowrap">
                    {formatINR(preview)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
