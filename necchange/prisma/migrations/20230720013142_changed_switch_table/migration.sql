/*
  Warnings:

  - You are about to drop the column `student_id` on the `switch` table. All the data in the column will be lost.
  - Added the required column `from_student_id` to the `switch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_student_id` to the `switch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "switch" DROP CONSTRAINT "switch_student_id_fkey";

-- AlterTable
ALTER TABLE "switch" DROP COLUMN "student_id",
ADD COLUMN     "from_student_id" INTEGER NOT NULL,
ADD COLUMN     "to_student_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_from_student_id_fkey" FOREIGN KEY ("from_student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_to_student_id_fkey" FOREIGN KEY ("to_student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
