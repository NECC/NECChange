-- DropForeignKey
ALTER TABLE "switch" DROP CONSTRAINT "switch_to_student_id_fkey";

-- AlterTable
ALTER TABLE "switch" ALTER COLUMN "close_time" DROP NOT NULL,
ALTER COLUMN "to_student_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_to_student_id_fkey" FOREIGN KEY ("to_student_id") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
