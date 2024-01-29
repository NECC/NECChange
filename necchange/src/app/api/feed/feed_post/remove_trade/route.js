import { PrismaClient, Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req, context) {
  const data = await req.json();

  const tradeId = parseInt(data.params.tradeId);

  const removeTrade = await prisma.$transaction(async (tx) => {
    await prisma.trade.update({
      where: {
        id: tradeId,
      },
      data: {
        status: Status.REMOVED,
        close_time: new Date(),
      },
    });
  });

  return new NextResponse(JSON.stringify({ response: removeTrade }));
}
