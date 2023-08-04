-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_USER', 'ADMIN', 'STUDENT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role";
