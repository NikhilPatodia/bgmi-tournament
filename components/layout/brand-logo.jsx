"use client";

import Link from "next/link";

export function BrandLogo({ compact = false }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group select-none">
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-[#ECA214] transition-transform group-hover:scale-105"
          viewBox="0 0 36 36"
          fill="none"
        >
          <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="2.5" />
          <path d="M18 2V8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M18 28V34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28 18H34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M2 18H8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="18" cy="18" r="3.5" fill="currentColor" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-base font-black tracking-widest text-white font-mono">
          NADEFLUX
        </span>
        {!compact && (
          <span className="text-[9px] tracking-[0.25em] text-[#ECA214] font-extrabold uppercase mt-0.5">
            Esports
          </span>
        )}
      </div>
    </Link>
  );
}
