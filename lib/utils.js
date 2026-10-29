import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names safely. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Format INR amounts for display. */
export function formatINR(amount) {
  const value = Number(amount ?? 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Convert Prisma Decimal / string / number to a plain number. */
export function toNumber(value) {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "object" && typeof value.toNumber === "function") {
    return value.toNumber();
  }
  return Number(value);
}

/** Mode → expected roster size. */
export function membersForMode(mode) {
  if (mode === "SOLO") return 1;
  if (mode === "DUO") return 2;
  return 4;
}

/** Default slots by mode. */
export function defaultSlotsForMode(mode) {
  if (mode === "SOLO") return 100;
  if (mode === "DUO") return 50;
  return 25;
}

/** Human label for tournament status. */
export function statusLabel(status) {
  const map = {
    UPCOMING: "Registration Open",
    REGISTRATION_CLOSED: "Registration Closed",
    CREDENTIALS_RELEASED: "Room Ready",
    LIVE: "Live Now",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return map[status] ?? status;
}
