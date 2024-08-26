-- CreateTable
CREATE TABLE "Dates" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "color" TEXT,
    "local" TEXT,
    "time" TEXT,

    CONSTRAINT "Dates_pkey" PRIMARY KEY ("id")
);
