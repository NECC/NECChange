/*
  Warnings:

  - Added the required column `end_time` to the `class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "class" ADD COLUMN     "end_time" VARCHAR(10) NOT NULL,
DROP COLUMN "start_time",
ADD COLUMN     "start_time" VARCHAR(10) NOT NULL;
