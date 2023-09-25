import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req, context) {
  const prisma = new PrismaClient();

  const trades_status = await prisma.tradePeriods.findFirst({
    select: {
      isOpen: true,
      openDate: true,
      closeDate: true,
    },
  });

  return new NextResponse(
    JSON.stringify({ response: "Success", status: trades_status })
  );
}
