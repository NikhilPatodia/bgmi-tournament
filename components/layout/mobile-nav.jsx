"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

const links = [
  { href: "/tournaments", label: "Browse" },
  { href: "/tournaments/create", label: "Host Match" },
  { href: "/wallet", label: "Wallet" },
  { href: "/profile", label: "Profile" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const items =
    user?.role === "ADMIN" ? [...links, { href: "/admin", label: "Admin" }] : links;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border border-[#1a2433] p-2 text-slate-300"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-16 z-50 border-b border-[#151D28] bg-[#080D14]/98 backdrop-blur-md px-4 py-3 space-y-1 animate-fade-in">
          {items.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-semibold",
                pathname?.startsWith(link.href)
                  ? "bg-amber-500/10 text-amber-300"
                  : "text-slate-300 hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
