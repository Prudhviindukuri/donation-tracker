-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'ONLINE');

-- AlterTable
ALTER TABLE "Donation" ADD COLUMN "fatherName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Donation" ADD COLUMN "donationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Donation" ADD COLUMN "paymentMode" "PaymentMode" NOT NULL DEFAULT 'CASH';

-- Backfill donationDate from createdAt for existing rows
UPDATE "Donation" SET "donationDate" = "createdAt" WHERE "donationDate" = "createdAt" OR "donationDate" IS NOT NULL;
