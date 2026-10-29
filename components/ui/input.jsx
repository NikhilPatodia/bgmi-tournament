"use client";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }) {
  return <input className={cn("nf-input", className)} {...props} />;
}
