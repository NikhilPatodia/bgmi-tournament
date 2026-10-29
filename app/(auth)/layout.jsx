import { BrandLogo } from "@/components/layout/brand-logo";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 0%, rgba(245,158,11,0.12), transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(6,182,212,0.08), transparent 45%), linear-gradient(180deg, #070B10, #05080E)",
        }}
      />
      <header className="relative z-10 px-6 py-6">
        <BrandLogo />
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 pb-16">
        {children}
      </main>
    </div>
  );
}
