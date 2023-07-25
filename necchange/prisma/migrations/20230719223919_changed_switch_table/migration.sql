/*
  Warnings:

  - You are about to drop the column `by_class` on the `switch` table. All the data in the column will be lost.
  - You are about to drop the column `by_id` on the `switch` table. All the data in the column will be lost.
  - You are about to drop the column `with_class` on the `switch` table. All the data in the column will be lost.
  - You are about to drop the column `with_id` on the `switch` table. All the data in the column will be lost.
  - Added the required column `class_from_id` to the `switch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_to_id` to the `switch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `switch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "switch" DROP CONSTRAINT "switch_by_class_fkey";

-- DropForeignKey
ALTER TABLE "switch" DROP CONSTRAINT "switch_by_id_fkey";

-- DropForeignKey
ALTER TABLE "switch" DROP CONSTRAINT "switch_with_class_fkey";

-- DropForeignKey
ALTER TABLE "switch" DROP CONSTRAINT "switch_with_id_fkey";

-- AlterTable
CREATE SEQUENCE switch_id_seq;
ALTER TABLE "switch" DROP COLUMN "by_class",
DROP COLUMN "by_id",
DROP COLUMN "with_class",
DROP COLUMN "with_id",
ADD COLUMN     "class_from_id" INTEGER NOT NULL,
ADD COLUMN     "class_to_id" INTEGER NOT NULL,
ADD COLUMN     "student_id" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('switch_id_seq');
ALTER SEQUENCE switch_id_seq OWNED BY "switch"."id";

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_class_from_id_fkey" FOREIGN KEY ("class_from_id") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_class_to_id_fkey" FOREIGN KEY ("class_to_id") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
