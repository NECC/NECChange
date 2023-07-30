/*
  Warnings:

  - You are about to drop the column `end_date` on the `switch` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `switch` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `switch` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `switch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "switch" DROP COLUMN "end_date",
DROP COLUMN "end_time",
DROP COLUMN "start_date",
DROP COLUMN "start_time",
ADD COLUMN     "close_time" VARCHAR(10),
ADD COLUMN     "publish_time" VARCHAR(10);
