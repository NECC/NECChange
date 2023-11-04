/*
  Warnings:

  - You are about to drop the column `firstname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[partnerNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'OUTSIDER';
ALTER TYPE "Role" ADD VALUE 'PARTNERSHIP';

-- DropForeignKey
ALTER TABLE "class" DROP CONSTRAINT "class_course_id_fkey";

-- DropForeignKey
ALTER TABLE "student_lesson" DROP CONSTRAINT "student_lesson_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "student_lesson" DROP CONSTRAINT "student_lesson_student_id_fkey";

-- DropForeignKey
ALTER TABLE "switch" DROP CONSTRAINT "switch_lesson_from_id_fkey";

-- DropForeignKey
ALTER TABLE "switch" DROP CONSTRAINT "switch_lesson_to_id_fkey";

-- DropForeignKey
ALTER TABLE "switch" DROP CONSTRAINT "switch_trade_id_fkey";

-- DropForeignKey
ALTER TABLE "trade" DROP CONSTRAINT "trade_from_student_id_fkey";

-- DropForeignKey
ALTER TABLE "trade" DROP CONSTRAINT "trade_to_student_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstname",
DROP COLUMN "lastname",
ADD COLUMN     "name" VARCHAR(100),
ADD COLUMN     "partnerNumber" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_partnerNumber_key" ON "User"("partnerNumber");

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_lesson" ADD CONSTRAINT "student_lesson_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_lesson" ADD CONSTRAINT "student_lesson_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("uniqueId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_trade_id_fkey" FOREIGN KEY ("trade_id") REFERENCES "trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_lesson_from_id_fkey" FOREIGN KEY ("lesson_from_id") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_lesson_to_id_fkey" FOREIGN KEY ("lesson_to_id") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade" ADD CONSTRAINT "trade_from_student_id_fkey" FOREIGN KEY ("from_student_id") REFERENCES "User"("uniqueId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade" ADD CONSTRAINT "trade_to_student_id_fkey" FOREIGN KEY ("to_student_id") REFERENCES "User"("uniqueId") ON DELETE CASCADE ON UPDATE CASCADE;
