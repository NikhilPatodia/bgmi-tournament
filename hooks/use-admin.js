"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/auth-provider";

async function jsonFetch(url, options) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

/** Leave admin screens immediately when the signed-in user is not an admin. */
export function useRequireAdmin() {
  const router = useRouter();
  const { user, isPending, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (isPending) return;
    if (!isAuthenticated) {
      router.replace("/sign-in");
      return;
    }
    if (!isAdmin) router.replace("/tournaments");
  }, [isAdmin, isAuthenticated, isPending, router]);

  return { isAdmin, isPending };
}

export function useAdminTournaments(enabled = true) {
  return useQuery({
    queryKey: ["admin-tournaments"],
    queryFn: () => jsonFetch("/api/admin/tournaments"),
    enabled,
  });
}

export function useUpdateTournament(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      jsonFetch(`/api/admin/tournaments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tournaments"] });
      qc.invalidateQueries({ queryKey: ["tournament", id] });
      qc.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });
}

export function usePendingPayments(enabled = true) {
  return useQuery({
    queryKey: ["admin-payments"],
    queryFn: () => jsonFetch("/api/admin/payments"),
    enabled,
  });
}

export function useReviewPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ kind, id, action }) =>
      jsonFetch(`/api/admin/payments/${kind}/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-payments"] });
      qc.invalidateQueries({ queryKey: ["wallet"] });
      qc.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });
}

export function useAdminWithdrawals(status = "PENDING", enabled = true) {
  return useQuery({
    queryKey: ["admin-withdrawals", status],
    queryFn: () => jsonFetch(`/api/admin/withdrawals?status=${status}`),
    enabled,
  });
}

export function useReviewWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      jsonFetch(`/api/admin/withdrawals/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-withdrawals"] });
      qc.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

export function useFinalizeTournament(tournamentId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      jsonFetch(`/api/admin/tournaments/${tournamentId}/finalize`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tournament", tournamentId] });
      qc.invalidateQueries({ queryKey: ["tournaments"] });
      qc.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}
