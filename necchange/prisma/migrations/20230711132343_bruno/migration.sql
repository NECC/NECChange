/*
  Warnings:

  - You are about to alter the column `name` on the `uc` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "uc" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);
