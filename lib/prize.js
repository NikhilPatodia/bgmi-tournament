import { toNumber } from "@/lib/utils";

/**
 * Compute prize amounts from tournament prizeBreakdown JSON + net pool.
 * Supports shapes like { rank1, rank2, rank3, perKill }.
 */
export function computePrizeWon(tournament, { rank, kills, isMvp }) {
  const net = toNumber(tournament.netPrizePool);
  const breakdown = tournament.prizeBreakdown || {};

  let prize = 0;

  if (rank === 1 && breakdown.rank1 != null) prize += Number(breakdown.rank1);
  else if (rank === 2 && breakdown.rank2 != null) prize += Number(breakdown.rank2);
  else if (rank === 3 && breakdown.rank3 != null) prize += Number(breakdown.rank3);
  else if (rank === 1) prize += Math.round(net * 0.5);
  else if (rank === 2) prize += Math.round(net * 0.3);
  else if (rank === 3) prize += Math.round(net * 0.2);

  const perKill = Number(breakdown.perKill ?? 0);
  if (perKill > 0) prize += kills * perKill;

  if (isMvp && breakdown.mvp != null) prize += Number(breakdown.mvp);

  return prize;
}

/** Rows players should see: 1st, 2nd, 3rd, most kills, per kill. */
export function listPrizePayouts(breakdown) {
  const source = breakdown || {};
  return [
    { key: "rank1", label: "1st place", amount: Number(source.rank1) || 0 },
    { key: "rank2", label: "2nd place", amount: Number(source.rank2) || 0 },
    { key: "rank3", label: "3rd place", amount: Number(source.rank3) || 0 },
    { key: "mvp", label: "Most kills", amount: Number(source.mvp) || 0 },
    { key: "perKill", label: "Per kill", amount: Number(source.perKill) || 0 },
  ].filter((row) => row.amount > 0);
}

/**
 * Split a finished result into the amounts that were added together.
 * Most kills is a flat bonus for the top-kill player, on top of placement.
 */
export function explainPrize(tournament, { rank, kills = 0, isMvp = false }) {
  const breakdown = tournament?.prizeBreakdown || {};
  const parts = [];

  if (rank === 1 && breakdown.rank1 != null) {
    parts.push({ label: "1st place", amount: Number(breakdown.rank1) || 0 });
  } else if (rank === 2 && breakdown.rank2 != null) {
    parts.push({ label: "2nd place", amount: Number(breakdown.rank2) || 0 });
  } else if (rank === 3 && breakdown.rank3 != null) {
    parts.push({ label: "3rd place", amount: Number(breakdown.rank3) || 0 });
  } else if (rank === 1) {
    parts.push({
      label: "1st place",
      amount: Math.round(toNumber(tournament?.netPrizePool) * 0.5),
    });
  } else if (rank === 2) {
    parts.push({
      label: "2nd place",
      amount: Math.round(toNumber(tournament?.netPrizePool) * 0.3),
    });
  } else if (rank === 3) {
    parts.push({
      label: "3rd place",
      amount: Math.round(toNumber(tournament?.netPrizePool) * 0.2),
    });
  }

  const perKill = Number(breakdown.perKill) || 0;
  if (perKill > 0 && kills > 0) {
    parts.push({ label: `${kills} kills × ${perKill}`, amount: kills * perKill });
  }

  if (isMvp && breakdown.mvp != null) {
    parts.push({ label: "Most kills bonus", amount: Number(breakdown.mvp) || 0 });
  }

  return {
    parts: parts.filter((part) => part.amount > 0),
    total: parts.reduce((sum, part) => sum + part.amount, 0),
  };
}

/** Build standard prize breakdown from net pool + preset. */
export function buildPrizeBreakdown(netPrize, preset = "STANDARD") {
  const net = Number(netPrize) || 0;
  if (preset === "WINNER_TAKES_ALL") {
    return { rank1: net, rank2: 0, rank3: 0, perKill: 0 };
  }
  return {
    rank1: Math.round(net * 0.5),
    rank2: Math.round(net * 0.3),
    rank3: Math.round(net * 0.2),
    perKill: 0,
  };
}
