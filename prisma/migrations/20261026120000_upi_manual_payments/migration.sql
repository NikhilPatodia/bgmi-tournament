-- Manual UPI verification for match entry and wallet deposits.
ALTER TYPE "RegistrationStatus" ADD VALUE IF NOT EXISTS 'PENDING_VERIFICATION';

ALTER TABLE "tournament_registration" ADD COLUMN IF NOT EXISTS "paymentUtr" TEXT;
ALTER TABLE "tournament_registration" ADD COLUMN IF NOT EXISTS "paymentProof" TEXT;

ALTER TABLE "wallet_transaction" ADD COLUMN IF NOT EXISTS "utrNumber" TEXT;
ALTER TABLE "wallet_transaction" ADD COLUMN IF NOT EXISTS "proofScreenshot" TEXT;
