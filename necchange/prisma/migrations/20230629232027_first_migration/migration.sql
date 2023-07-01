-- CreateTable
CREATE TABLE "class" (
    "id" INTEGER NOT NULL,
    "uc_id" INTEGER,
    "weekday" INTEGER,
    "start_time" TIME(6),
    "local" VARCHAR(100),
    "type" INTEGER,
    "shift" INTEGER,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" INTEGER NOT NULL,
    "number" INTEGER,
    "firstname" VARCHAR(100),
    "lastname" VARCHAR(100),
    "email" VARCHAR(100),
    "password" VARCHAR(100),
    "is_admin" BOOLEAN,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_class" (
    "student_id" INTEGER,
    "class_id" INTEGER
);

-- CreateTable
CREATE TABLE "switch" (
    "id" INTEGER NOT NULL,
    "by_id" INTEGER,
    "by_class" INTEGER,
    "with_id" INTEGER,
    "with_class" INTEGER,
    "status" INTEGER,
    "start_date" DATE,
    "start_time" TIME(6),
    "end_date" DATE,
    "end_time" TIME(6),

    CONSTRAINT "switch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uc" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(50),
    "year" INTEGER,
    "semester" INTEGER,

    CONSTRAINT "uc_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_uc_id_fkey" FOREIGN KEY ("uc_id") REFERENCES "uc"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_class" ADD CONSTRAINT "student_class_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_class" ADD CONSTRAINT "student_class_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_by_class_fkey" FOREIGN KEY ("by_class") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_by_id_fkey" FOREIGN KEY ("by_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_with_class_fkey" FOREIGN KEY ("with_class") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_with_id_fkey" FOREIGN KEY ("with_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
