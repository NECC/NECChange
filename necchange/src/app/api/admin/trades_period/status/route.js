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

  await prisma.$disconnect()

  return new NextResponse(
    JSON.stringify({ response: "Success", status: trades_status })
  );
}
