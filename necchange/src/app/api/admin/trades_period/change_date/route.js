import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req, context) {
  const params = await req.json();

  const isOpen = params.close ? false : true;
  const openDate = isOpen ? params.openDate : new Date();
  const closeDate = isOpen ? params.closeDate : new Date();

  await prisma.tradePeriods.updateMany({
    data: {
      isOpen: isOpen,
      openDate: openDate, // if we want to close the trades period we know at what time we did that
      closeDate: closeDate,
    },
  });

  await prisma.$disconnect()

  return new NextResponse(JSON.stringify({ response: "Success" }));
}
