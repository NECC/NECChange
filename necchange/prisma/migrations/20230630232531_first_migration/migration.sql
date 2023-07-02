/*
  Warnings:

  - Added the required column `id` to the `student_class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student_class" ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "student_class_pkey" PRIMARY KEY ("id");
