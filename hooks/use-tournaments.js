"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function jsonFetch(url, options) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export function useTournaments(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v) params.set(k, v);
  });
  const qs = params.toString();

  return useQuery({
    queryKey: ["tournaments", filters],
    queryFn: () => jsonFetch(`/api/tournaments${qs ? `?${qs}` : ""}`),
  });
}

export function useTournament(id) {
  return useQuery({
    queryKey: ["tournament", id],
    queryFn: () => jsonFetch(`/api/tournaments/${id}`),
    enabled: Boolean(id),
  });
}

export function useTournamentCredentials(id, enabled = true) {
  return useQuery({
    queryKey: ["tournament-credentials", id],
    queryFn: () => jsonFetch(`/api/tournaments/${id}/credentials`),
    enabled: Boolean(id) && enabled,
    refetchInterval: (query) => (query.state.data?.ready ? false : 15_000),
  });
}

export function useCreateTournament() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      jsonFetch("/api/tournaments", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });
}

export function useRegisterTournament(tournamentId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      jsonFetch(`/api/tournaments/${tournamentId}/register`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ["tournament", tournamentId] });
      const previous = qc.getQueryData(["tournament", tournamentId]);

      if (previous?.tournament) {
        qc.setQueryData(["tournament", tournamentId], {
          ...previous,
          tournament: {
            ...previous.tournament,
            filledSlots: (previous.tournament.filledSlots || 0) + 1,
            myRegistration: {
              slotNumber: payload.slotNumber,
              teamName: payload.teamName,
              status: "CONFIRMED",
            },
          },
        });
      }

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(["tournament", tournamentId], ctx.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tournament", tournamentId] });
      qc.invalidateQueries({ queryKey: ["tournaments"] });
      qc.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}
