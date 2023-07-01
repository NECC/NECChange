/*
  Warnings:

  - The `start_date` column on the `switch` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `start_time` column on the `switch` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `end_date` column on the `switch` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `end_time` column on the `switch` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[number]` on the table `student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "student" ALTER COLUMN "number" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "switch" DROP COLUMN "start_date",
ADD COLUMN     "start_date" VARCHAR(10),
DROP COLUMN "start_time",
ADD COLUMN     "start_time" VARCHAR(10),
DROP COLUMN "end_date",
ADD COLUMN     "end_date" VARCHAR(10),
DROP COLUMN "end_time",
ADD COLUMN     "end_time" VARCHAR(10);

-- CreateIndex
CREATE UNIQUE INDEX "student_number_key" ON "student"("number");
