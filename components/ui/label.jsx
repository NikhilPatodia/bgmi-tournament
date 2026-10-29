"use client";

import { cn } from "@/lib/utils";

export function Label({ className, children, ...props }) {
  return (
    <label className={cn("nf-label", className)} {...props}>
      {children}
    </label>
  );
}
