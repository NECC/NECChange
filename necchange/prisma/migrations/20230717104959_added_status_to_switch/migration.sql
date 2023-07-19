/*
  Warnings:

  - The `status` column on the `switch` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('REMOVED', 'PENDING', 'ACCEPTED');

-- AlterTable
ALTER TABLE "switch" DROP COLUMN "status",
ADD COLUMN     "status" "Status";
