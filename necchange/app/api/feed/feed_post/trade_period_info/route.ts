import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any){
    const prisma = new PrismaClient();

    const trades_status = await prisma.tradePeriods.findFirst({
        select: {
            isOpen: true,
            openDate: true,
            closeDate: true
        }
    })

    
    if(trades_status?.openDate && trades_status?.closeDate ){
        const date = new Date()
        const is_open = (date > trades_status.openDate && date < trades_status.closeDate) ? true : false

        return new NextResponse(JSON.stringify({open: is_open}));
    }  
    
    return new NextResponse(JSON.stringify({open: false}));
}