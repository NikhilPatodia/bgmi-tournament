"use client";

import { cn } from "@/lib/utils";

const variants = {
  default:
    "bg-[#F59E0B] text-black hover:bg-[#ECA214] shadow-lg shadow-amber-950/40",
  secondary:
    "bg-[#151D28] text-white border border-[#243044] hover:bg-[#1a2433]",
  outline:
    "border border-[#F59E0B]/50 text-[#F59E0B] hover:bg-[#F59E0B]/10",
  ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
  danger: "bg-red-600/90 text-white hover:bg-red-500",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
  icon: "h-9 w-9",
};

export function Button({
  className,
  variant = "default",
  size = "md",
  type = "button",
  disabled,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-bold tracking-wide transition-colors disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
