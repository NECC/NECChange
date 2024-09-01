import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, context) {

  const trades_status = await prisma.tradePeriods.findFirst({
    select: {
      isOpen: true,
      openDate: true,
      closeDate: true,
    },
  });

  if (trades_status.openDate && trades_status?.closeDate) {
    const date = new Date();
    const is_open =
      date > trades_status.openDate && date < trades_status.closeDate
        ? true
        : false;

    return new NextResponse(JSON.stringify({ open: is_open }));
  }

  await prisma.$disconnect()
  return new NextResponse(JSON.stringify({ open: false }));
}
