/*
  Warnings:

  - The values [ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `uc_id` on the `class` table. All the data in the column will be lost.
  - You are about to drop the column `class_from_id` on the `switch` table. All the data in the column will be lost.
  - You are about to drop the column `class_to_id` on the `switch` table. All the data in the column will be lost.
  - You are about to drop the `student_class` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `uc` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lesson_from_id` to the `switch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lesson_to_id` to the `switch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('SUPER_USER', 'PROFESSOR', 'STUDENT');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "class" DROP CONSTRAINT "class_uc_id_fkey";

-- DropForeignKey
ALTER TABLE "student_class" DROP CONSTRAINT "student_class_class_id_fkey";

-- DropForeignKey
ALTER TABLE "student_class" DROP CONSTRAINT "student_class_student_id_fkey";

-- DropForeignKey
ALTER TABLE "switch" DROP CONSTRAINT "switch_class_from_id_fkey";

-- DropForeignKey
ALTER TABLE "switch" DROP CONSTRAINT "switch_class_to_id_fkey";

-- AlterTable
ALTER TABLE "class" DROP COLUMN "uc_id",
ADD COLUMN     "course_id" INTEGER;

-- AlterTable
ALTER TABLE "switch" DROP COLUMN "class_from_id",
DROP COLUMN "class_to_id",
ADD COLUMN     "lesson_from_id" INTEGER NOT NULL,
ADD COLUMN     "lesson_to_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "student_class";

-- DropTable
DROP TABLE "uc";

-- CreateTable
CREATE TABLE "student_lesson" (
    "id" INTEGER NOT NULL,
    "student_id" INTEGER,
    "lesson_id" INTEGER,

    CONSTRAINT "student_lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(100),
    "year" INTEGER,
    "semester" INTEGER,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_lesson" ADD CONSTRAINT "student_lesson_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_lesson" ADD CONSTRAINT "student_lesson_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_lesson_from_id_fkey" FOREIGN KEY ("lesson_from_id") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_lesson_to_id_fkey" FOREIGN KEY ("lesson_to_id") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
