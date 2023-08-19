/*
  Warnings:

  - You are about to drop the column `unique_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uniqueId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "student_lesson" DROP CONSTRAINT "student_lesson_student_id_fkey";

-- DropForeignKey
ALTER TABLE "trade" DROP CONSTRAINT "trade_from_student_id_fkey";

-- DropForeignKey
ALTER TABLE "trade" DROP CONSTRAINT "trade_to_student_id_fkey";

-- DropIndex
DROP INDEX "User_unique_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "unique_id",
ADD COLUMN     "uniqueId" SERIAL;

-- CreateIndex
CREATE UNIQUE INDEX "User_uniqueId_key" ON "User"("uniqueId");

-- AddForeignKey
ALTER TABLE "student_lesson" ADD CONSTRAINT "student_lesson_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trade" ADD CONSTRAINT "trade_from_student_id_fkey" FOREIGN KEY ("from_student_id") REFERENCES "User"("uniqueId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade" ADD CONSTRAINT "trade_to_student_id_fkey" FOREIGN KEY ("to_student_id") REFERENCES "User"("uniqueId") ON DELETE SET NULL ON UPDATE CASCADE;
