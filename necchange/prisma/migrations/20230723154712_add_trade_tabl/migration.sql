/*
  Warnings:

  - You are about to drop the column `close_time` on the `switch` table. All the data in the column will be lost.
  - You are about to drop the column `from_student_id` on the `switch` table. All the data in the column will be lost.
  - You are about to drop the column `publish_time` on the `switch` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `switch` table. All the data in the column will be lost.
  - You are about to drop the column `to_student_id` on the `switch` table. All the data in the column will be lost.
  - Added the required column `trade_id` to the `switch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "switch" DROP CONSTRAINT "switch_from_student_id_fkey";

-- DropForeignKey
ALTER TABLE "switch" DROP CONSTRAINT "switch_to_student_id_fkey";

-- AlterTable
ALTER TABLE "switch" DROP COLUMN "close_time",
DROP COLUMN "from_student_id",
DROP COLUMN "publish_time",
DROP COLUMN "status",
DROP COLUMN "to_student_id",
ADD COLUMN     "trade_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "trade" (
    "id" SERIAL NOT NULL,
    "from_student_id" INTEGER NOT NULL,
    "to_student_id" INTEGER,
    "status" "Status",
    "publish_time" TIMESTAMP(3) NOT NULL,
    "close_time" TIMESTAMP(3),

    CONSTRAINT "trade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_trade_id_fkey" FOREIGN KEY ("trade_id") REFERENCES "trade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade" ADD CONSTRAINT "trade_from_student_id_fkey" FOREIGN KEY ("from_student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade" ADD CONSTRAINT "trade_to_student_id_fkey" FOREIGN KEY ("to_student_id") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
