"use client";

import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("nf-panel", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn("px-5 pt-5 pb-2", className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return (
    <h3 className={cn("text-base font-bold text-white tracking-wide", className)}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children }) {
  return <div className={cn("px-5 pb-5", className)}>{children}</div>;
}
