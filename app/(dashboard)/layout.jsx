import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col text-[#DCE4EE]">
      <Suspense fallback={<div className="h-16 border-b border-[#141C28] bg-[#080D14]" />}>
        <Navbar />
      </Suspense>
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Suspense fallback={<div className="nf-panel h-48 animate-pulse" />}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
