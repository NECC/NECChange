-- CreateEnum
CREATE TYPE "Status" AS ENUM ('REMOVED', 'PENDING', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_USER', 'PROFESSOR', 'STUDENT');

-- CreateTable
CREATE TABLE "class" (
    "id" INTEGER NOT NULL,
    "course_id" INTEGER,
    "weekday" INTEGER,
    "start_time" VARCHAR(10) NOT NULL,
    "end_time" VARCHAR(10) NOT NULL,
    "local" VARCHAR(100),
    "type" INTEGER,
    "shift" INTEGER,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_lesson" (
    "id" INTEGER NOT NULL,
    "student_id" INTEGER,
    "lesson_id" INTEGER,

    CONSTRAINT "student_lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "switch" (
    "id" SERIAL NOT NULL,
    "lesson_from_id" INTEGER NOT NULL,
    "lesson_to_id" INTEGER NOT NULL,
    "trade_id" INTEGER NOT NULL,

    CONSTRAINT "switch_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "course" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(100),
    "year" INTEGER,
    "semester" INTEGER,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "uniqueId" SERIAL NOT NULL,
    "number" VARCHAR(20),
    "firstname" VARCHAR(100),
    "lastname" VARCHAR(100),
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "partner" BOOLEAN,
    "role" "Role",

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradePeriods" (
    "id" SERIAL NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "openDate" TIMESTAMP(3),
    "closeDate" TIMESTAMP(3),

    CONSTRAINT "TradePeriods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_uniqueId_key" ON "User"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "User_number_key" ON "User"("number");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_lesson" ADD CONSTRAINT "student_lesson_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_lesson" ADD CONSTRAINT "student_lesson_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("uniqueId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_trade_id_fkey" FOREIGN KEY ("trade_id") REFERENCES "trade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_lesson_from_id_fkey" FOREIGN KEY ("lesson_from_id") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "switch" ADD CONSTRAINT "switch_lesson_to_id_fkey" FOREIGN KEY ("lesson_to_id") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade" ADD CONSTRAINT "trade_from_student_id_fkey" FOREIGN KEY ("from_student_id") REFERENCES "User"("uniqueId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade" ADD CONSTRAINT "trade_to_student_id_fkey" FOREIGN KEY ("to_student_id") REFERENCES "User"("uniqueId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
