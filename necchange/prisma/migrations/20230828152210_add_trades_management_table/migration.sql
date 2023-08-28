/*
  Warnings:

  - Made the column `uniqueId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "uniqueId" SET NOT NULL;

-- CreateTable
CREATE TABLE "TradePeriods" (
    "id" SERIAL NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "openDate" TIMESTAMP(3),
    "closeDate" TIMESTAMP(3),

    CONSTRAINT "TradePeriods_pkey" PRIMARY KEY ("id")
);
