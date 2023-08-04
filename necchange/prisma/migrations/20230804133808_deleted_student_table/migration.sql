/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `student` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[unique_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "student_lesson" DROP CONSTRAINT "student_lesson_student_id_fkey";

-- DropForeignKey
ALTER TABLE "trade" DROP CONSTRAINT "trade_from_student_id_fkey";

-- DropForeignKey
ALTER TABLE "trade" DROP CONSTRAINT "trade_to_student_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
DROP COLUMN "name",
ADD COLUMN     "firstname" VARCHAR(100),
ADD COLUMN     "is_admin" BOOLEAN,
ADD COLUMN     "lastname" VARCHAR(100),
ADD COLUMN     "number" VARCHAR(20),
ADD COLUMN     "unique_id" SERIAL NOT NULL;

-- DropTable
DROP TABLE "student";

-- CreateIndex
CREATE UNIQUE INDEX "User_unique_id_key" ON "User"("unique_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_number_key" ON "User"("number");

-- AddForeignKey
ALTER TABLE "student_lesson" ADD CONSTRAINT "student_lesson_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("unique_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trade" ADD CONSTRAINT "trade_from_student_id_fkey" FOREIGN KEY ("from_student_id") REFERENCES "User"("unique_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade" ADD CONSTRAINT "trade_to_student_id_fkey" FOREIGN KEY ("to_student_id") REFERENCES "User"("unique_id") ON DELETE SET NULL ON UPDATE CASCADE;
