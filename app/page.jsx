import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Footer } from "@/components/layout/footer";
import { UserNav } from "@/components/layout/user-nav";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col text-[#DCE4EE]">
      <header className="absolute top-0 inset-x-0 z-20 px-4 sm:px-8 py-5 flex items-center justify-between">
        <BrandLogo />
        <div className="flex items-center gap-2">
          <UserNav appearance="text" />
          <Link href="/tournaments">
            <Button size="sm">Browse matches</Button>
          </Link>
        </div>
      </header>

      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(7,11,16,0.92) 0%, rgba(7,11,16,0.55) 45%, rgba(7,11,16,0.85) 100%), radial-gradient(ellipse at 70% 40%, rgba(245,158,11,0.18), transparent 55%), url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-4 sm:px-8 pt-24 pb-16">
          <p className="font-mono text-xs tracking-[0.35em] text-[#ECA214] font-extrabold uppercase mb-4 animate-fade-in">
            Nadeflux Esports
          </p>
          <h1 className="max-w-3xl text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.05] animate-fade-in">
            Drop in. Claim the lobby.
            <span className="block text-amber-300">Cash out the chicken.</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm sm:text-base text-slate-300 leading-relaxed animate-fade-in">
            Official & community BGMI custom rooms with dual-wallet payments,
            slot-locked squads, and timed credential drops.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-fade-in">
            <Link href="/tournaments">
              <Button size="lg">Enter arena</Button>
            </Link>
            <Link href="/tournaments/create">
              <Button size="lg" variant="outline">
                Host a match
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto w-full px-4 sm:px-8 py-16 grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Slot-locked registration",
            body: "Pick a vacant squad slot. Concurrent bookings are rejected with ACID transactions.",
          },
          {
            title: "Dual wallet ledger",
            body: "Deposit balance for entries. Winning balance for entries or UPI withdrawals.",
          },
          {
            title: "Timed room credentials",
            body: "Custom room ID & password unlock on countdown — only for registered captains.",
          },
        ].map((item) => (
          <div key={item.title} className="nf-panel p-5">
            <h2 className="text-sm font-bold text-white">{item.title}</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
