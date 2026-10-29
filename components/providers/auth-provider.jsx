"use client";

import { createContext, useContext, useMemo } from "react";
import { useSession } from "@/lib/auth-client";

const AuthContext = createContext({
  session: null,
  user: null,
  isPending: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }) {
  const { data, isPending, error } = useSession();

  const value = useMemo(
    () => ({
      session: data ?? null,
      user: data?.user ?? null,
      isPending,
      isAuthenticated: Boolean(data?.user),
      error,
    }),
    [data, isPending, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
