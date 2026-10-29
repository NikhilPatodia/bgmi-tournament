/*
  Warnings:

  - A unique constraint covering the columns `[bgmiId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'HOST', 'ADMIN');

-- CreateEnum
CREATE TYPE "MatchMode" AS ENUM ('SOLO', 'DUO', 'SQUAD');

-- CreateEnum
CREATE TYPE "MatchMap" AS ENUM ('ERANGEL', 'MIRAMAR', 'SANHOK', 'VIKENDI');

-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('UPCOMING', 'REGISTRATION_CLOSED', 'CREDENTIALS_RELEASED', 'LIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('CONFIRMED', 'CANCELLED', 'DISQUALIFIED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL_REQUEST', 'WITHDRAWAL_REFUND', 'ENTRY_FEE', 'ENTRY_REFUND', 'PRIZE_PAYOUT', 'HOST_COMMISSION');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSED');

-- DropIndex
DROP INDEX "account_userId_idx";

-- DropIndex
DROP INDEX "session_userId_idx";

-- DropIndex
DROP INDEX "verification_identifier_idx";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "bgmiId" TEXT,
ADD COLUMN     "bgmiIgn" TEXT,
ADD COLUMN     "depositBalance" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "winningBalance" DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- CreateTable
CREATE TABLE "tournament" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "bannerUrl" TEXT,
    "mode" "MatchMode" NOT NULL DEFAULT 'SQUAD',
    "map" "MatchMap" NOT NULL DEFAULT 'ERANGEL',
    "status" "TournamentStatus" NOT NULL DEFAULT 'UPCOMING',
    "startTime" TIMESTAMP(3) NOT NULL,
    "releaseTime" TIMESTAMP(3),
    "maxSlots" INTEGER NOT NULL,
    "filledSlots" INTEGER NOT NULL DEFAULT 0,
    "entryFee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "grossPrizePool" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "platformFeePct" DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    "netPrizePool" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "prizeBreakdown" JSONB,
    "customRoomId" TEXT,
    "customRoomPass" TEXT,
    "hostId" TEXT NOT NULL,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_registration" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slotNumber" INTEGER NOT NULL,
    "teamName" TEXT,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'CONFIRMED',
    "amountPaid" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tournament_registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registration_member" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "userId" TEXT,
    "ign" TEXT NOT NULL,
    "bgmiId" TEXT NOT NULL,
    "isCaptain" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "registration_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_result" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "kills" INTEGER NOT NULL DEFAULT 0,
    "placementPoints" INTEGER NOT NULL DEFAULT 0,
    "killPoints" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "prizeWon" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "isMvp" BOOLEAN NOT NULL DEFAULT false,
    "proofScreenshot" TEXT,

    CONSTRAINT "tournament_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "balanceAfter" DECIMAL(10,2),
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'SUCCESS',
    "gatewayPaymentId" TEXT,
    "referenceId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawal_request" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "upiId" TEXT NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "utrNumber" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "withdrawal_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tournament_status_startTime_idx" ON "tournament"("status", "startTime");

-- CreateIndex
CREATE INDEX "tournament_registration_tournamentId_idx" ON "tournament_registration"("tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "tournament_registration_tournamentId_slotNumber_key" ON "tournament_registration"("tournamentId", "slotNumber");

-- CreateIndex
CREATE UNIQUE INDEX "tournament_registration_tournamentId_userId_key" ON "tournament_registration"("tournamentId", "userId");

-- CreateIndex
CREATE INDEX "registration_member_registrationId_idx" ON "registration_member"("registrationId");

-- CreateIndex
CREATE INDEX "registration_member_bgmiId_idx" ON "registration_member"("bgmiId");

-- CreateIndex
CREATE UNIQUE INDEX "tournament_result_registrationId_key" ON "tournament_result"("registrationId");

-- CreateIndex
CREATE INDEX "tournament_result_tournamentId_rank_idx" ON "tournament_result"("tournamentId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_transaction_gatewayPaymentId_key" ON "wallet_transaction"("gatewayPaymentId");

-- CreateIndex
CREATE INDEX "wallet_transaction_userId_createdAt_idx" ON "wallet_transaction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "withdrawal_request_userId_status_idx" ON "withdrawal_request"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "user_bgmiId_key" ON "user"("bgmiId");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");

-- AddForeignKey
ALTER TABLE "tournament" ADD CONSTRAINT "tournament_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_registration" ADD CONSTRAINT "tournament_registration_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_registration" ADD CONSTRAINT "tournament_registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration_member" ADD CONSTRAINT "registration_member_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "tournament_registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration_member" ADD CONSTRAINT "registration_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_result" ADD CONSTRAINT "tournament_result_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_result" ADD CONSTRAINT "tournament_result_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "tournament_registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transaction" ADD CONSTRAINT "wallet_transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawal_request" ADD CONSTRAINT "withdrawal_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
