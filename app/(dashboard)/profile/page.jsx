"use client";

import { useState } from "react";
import { BgmiProfileForm } from "@/components/forms/bgmi-profile-form";
import { Toast } from "@/components/ui/toast";
import { useAuth } from "@/components/providers/auth-provider";
import { useProfile, useUpdateProfile } from "@/hooks/use-wallet";
import { formatINR } from "@/lib/utils";

export default function ProfilePage() {
  const { user, isAuthenticated, isPending } = useAuth();
  const { data, isLoading } = useProfile();
  const update = useUpdateProfile();
  const [toast, setToast] = useState("");

  if (isPending || isLoading) {
    return <div className="nf-panel h-64 animate-pulse" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="nf-panel p-8 text-sm text-slate-400">
        Sign in to bind your BGMI identity.
      </div>
    );
  }

  const profile = data?.user;

  return (
    <>
      <div className="max-w-2xl space-y-6">
        <div className="nf-panel p-5 flex items-center gap-4">
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt=""
              className="h-14 w-14 rounded-xl object-cover border border-[#1a2433]"
            />
          ) : (
            <div className="h-14 w-14 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-lg font-black">
              {(user?.name || "P").slice(0, 1)}
            </div>
          )}
          <div>
            <h1 className="text-xl font-black text-white">{user?.name}</h1>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <p className="text-[11px] text-slate-600 mt-1">
              Wallet {formatINR((profile?.depositBalance || 0) + (profile?.winningBalance || 0))}
            </p>
          </div>
        </div>

        <div className="nf-panel p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white">BGMI identity</h2>
            <p className="text-xs text-slate-500 mt-1">
              Bind your IGN and 10-digit Character ID used for roster registration.
            </p>
          </div>
          <BgmiProfileForm
            defaults={profile}
            isSubmitting={update.isPending}
            onSubmit={async (values) => {
              try {
                await update.mutateAsync(values);
                setToast("BGMI profile saved");
              } catch (err) {
                setToast(err.message);
              }
            }}
          />
        </div>
      </div>
      <Toast message={toast} />
    </>
  );
}
