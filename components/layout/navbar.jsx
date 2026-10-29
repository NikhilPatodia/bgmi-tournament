"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { UserNav } from "@/components/layout/user-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useWallet } from "@/hooks/use-wallet";
import { useAuth } from "@/components/providers/auth-provider";
import { cn, formatINR } from "@/lib/utils";

const navLinks = [
  { href: "/tournaments", label: "Browse Tournaments" },
  { href: "/tournaments/create", label: "Host Match" },
  { href: "/wallet", label: "Wallet" },
  { href: "/profile", label: "Profile" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const links =
    user?.role === "ADMIN"
      ? [...navLinks, { href: "/admin", label: "Admin" }]
      : navLinks;
  const { data: wallet } = useWallet();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080D14]/95 backdrop-blur-md border-b border-[#141C28]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 relative">
        <div className="flex items-center gap-8">
          <BrandLogo />
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold tracking-wider">
            {links.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === "/admin" || pathname?.startsWith("/admin/")
                  : link.href === "/tournaments"
                    ? pathname === "/tournaments" ||
                      /^\/tournaments\/(?!create(?:\/|$))/.test(pathname || "")
                    : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-1 transition-colors",
                    active ? "text-white font-bold" : "text-neutral-400 hover:text-neutral-200"
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-white rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Link
              href="/wallet"
              className="hidden sm:flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300"
            >
              <Wallet className="h-3.5 w-3.5" />
              {formatINR(wallet?.totalBalance ?? 0)}
            </Link>
          )}
          <UserNav />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
