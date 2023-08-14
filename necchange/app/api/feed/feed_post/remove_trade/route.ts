import { PrismaClient, Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, context: any) {
    const data = await req.json()

    const tradeId = parseInt(data.params.tradeId);
    const prisma = new PrismaClient()

    const removeTrade = await prisma.$transaction(async (tx) => {
        await prisma.trade.update({
            where: {
                id: tradeId,
            },
            data:{
                status: Status.REMOVED,
                close_time: new Date()
            }
        })
    })

    return new NextResponse(JSON.stringify({response: removeTrade}))

}