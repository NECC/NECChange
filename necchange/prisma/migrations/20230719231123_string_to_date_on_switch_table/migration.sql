/*
  Warnings:

  - Added the required column `close_time` to the `switch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publish_time` to the `switch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "switch" DROP COLUMN "close_time",
ADD COLUMN     "close_time" TIMESTAMP(3) NOT NULL,
DROP COLUMN "publish_time",
ADD COLUMN     "publish_time" TIMESTAMP(3) NOT NULL;
