"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { OAuthButtons } from "@/components/modules/auth/oauth-buttons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signUp.email({
        name,
        email,
        password,
        callbackURL: "/tournaments",
      });
      if (error) throw new Error(error.message || "Sign up failed");
      window.location.href = "/tournaments";
    } catch (err) {
      setToast(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-md nf-panel p-6 sm:p-8 animate-fade-in">
        <p className="font-mono text-[10px] tracking-[0.3em] text-[#ECA214] font-extrabold uppercase">
          Nadeflux Esports
        </p>
        <h1 className="mt-2 text-2xl font-black text-white tracking-tight">
          Create your player account
        </h1>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          Bind OAuth or email now — add your BGMI IGN & Character ID from Profile after signup.
        </p>

        <div className="mt-6">
          <OAuthButtons callbackURL="/tournaments" />
        </div>

        <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-widest text-slate-600 font-bold">
          <div className="h-px flex-1 bg-[#1a2433]" />
          or email
          <div className="h-px flex-1 bg-[#1a2433]" />
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="name">Display name</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating…" : "Create account"}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          Already competing?{" "}
          <Link href="/sign-in" className="text-amber-300 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      <Toast message={toast} />
    </>
  );
}
