import { z } from "zod";

const bgmiIdSchema = z
  .string()
  .transform((v) => v.replace(/\s+/g, ""))
  .refine((v) => /^\d{10}$/.test(v), {
    message: "BGMI Character ID must be exactly 10 digits",
  });

const upiSchema = z
  .string()
  .trim()
  .min(5, "UPI ID is required")
  .regex(/^[\w.\-]{2,}@[\w.\-]{2,}$/, "Enter a valid UPI VPA (e.g. name@okhdfcbank)");

export const rosterMemberSchema = z.object({
  ign: z.string().trim().min(2, "IGN is required").max(24),
  bgmiId: bgmiIdSchema,
  isCaptain: z.boolean().optional().default(false),
});

export const tournamentRegistrationSchema = z.object({
  slotNumber: z.coerce.number().int().min(1).max(100),
  teamName: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => (v && v.length >= 2 ? v : undefined)),
  members: z.array(rosterMemberSchema).min(1).max(4),
  acceptRules: z.boolean().refine((v) => v === true, {
    message: "You must accept the tournament rules",
  }),
  paymentUtr: z.string().trim().max(40).optional().or(z.literal("")),
  paymentProof: z.string().max(2_500_000).optional().or(z.literal("")),
});

export const createTournamentSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(80),
  description: z.string().trim().max(2000).optional(),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  mode: z.enum(["SOLO", "DUO", "SQUAD"]),
  map: z.enum(["ERANGEL", "MIRAMAR", "SANHOK", "VIKENDI"]),
  startTime: z.string().min(1, "Start time is required"),
  releaseTime: z.string().optional(),
  maxSlots: z.coerce.number().int().min(2).max(100),
  entryFee: z.coerce.number().min(0).max(10000),
  platformFeePct: z.coerce.number().min(0).max(50).default(10),
  prizePreset: z.enum(["STANDARD", "WINNER_TAKES_ALL", "CUSTOM"]).default("STANDARD"),
  prizeRank1: z.coerce.number().min(0).max(1000000).default(0),
  prizeRank2: z.coerce.number().min(0).max(1000000).default(0),
  prizeMostKills: z.coerce.number().min(0).max(1000000).default(0),
  customRoomId: z.string().trim().max(40).optional(),
  customRoomPass: z.string().trim().max(40).optional(),
});

export const updateTournamentSchema = z.object({
  title: z.string().trim().min(5).max(80),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  mode: z.enum(["SOLO", "DUO", "SQUAD"]),
  map: z.enum(["ERANGEL", "MIRAMAR", "SANHOK", "VIKENDI"]),
  status: z.enum([
    "UPCOMING",
    "REGISTRATION_CLOSED",
    "CREDENTIALS_RELEASED",
    "LIVE",
    "COMPLETED",
    "CANCELLED",
  ]),
  startTime: z.string().min(1),
  releaseTime: z.string().optional().or(z.literal("")),
  maxSlots: z.coerce.number().int().min(2).max(100),
  entryFee: z.coerce.number().min(0).max(10000),
  prizeRank1: z.coerce.number().min(0).max(1000000).default(0),
  prizeRank2: z.coerce.number().min(0).max(1000000).default(0),
  prizeMostKills: z.coerce.number().min(0).max(1000000).default(0),
  customRoomId: z.string().trim().max(40).optional().or(z.literal("")),
  customRoomPass: z.string().trim().max(40).optional().or(z.literal("")),
});

export const bgmiProfileSchema = z.object({
  bgmiIgn: z.string().trim().min(2, "IGN is required").max(24),
  bgmiId: bgmiIdSchema,
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")
    .optional()
    .or(z.literal("")),
});

export const withdrawalSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0").max(100000),
  upiId: upiSchema,
});

export const manualDepositSchema = z
  .object({
    amount: z.coerce.number().min(50, "Minimum deposit is ₹50").max(50000),
    utrNumber: z.string().trim().max(40).optional().or(z.literal("")),
    proofScreenshot: z.string().max(2_500_000).optional().or(z.literal("")),
  })
  .refine(
    (data) =>
      (data.utrNumber && data.utrNumber.length >= 6) ||
      (data.proofScreenshot && data.proofScreenshot.startsWith("data:image/")),
    { message: "Enter a UTR of at least 6 characters or upload a payment screenshot" }
  );

export const adminPaymentReviewSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  adminNote: z.string().trim().max(500).optional(),
});

export const finalizeResultRowSchema = z.object({
  registrationId: z.string().min(1),
  rank: z.coerce.number().int().min(1).max(100),
  kills: z.coerce.number().int().min(0).max(100),
  placementPoints: z.coerce.number().int().min(0).max(100).default(0),
  killPoints: z.coerce.number().int().min(0).max(500).default(0),
  isMvp: z.boolean().optional().default(false),
  proofScreenshot: z.string().url().optional().or(z.literal("")),
});

export const finalizeTournamentSchema = z.object({
  results: z.array(finalizeResultRowSchema).min(1),
});

export const adminWithdrawalSchema = z.object({
  action: z.enum(["APPROVE", "REJECT", "PROCESS"]),
  utrNumber: z.string().trim().min(6).max(40).optional(),
  adminNote: z.string().trim().max(500).optional(),
});
