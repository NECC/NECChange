import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Status } from "@prisma/client";

export async function GET(req: NextRequest, context: any) {
    const prisma = new PrismaClient();

    const limit = parseInt(context.params.limit)
    
    
    const trades = await prisma.trade.findMany({
        where:{
          status: Status.PENDING
        },
        orderBy: {
          id: 'asc'
        },
        take: limit,

        select: {
          id: true,
          publish_time: true,
          from_student: {
            select: {
              number: true
            }
          },
          trade_id: {
            select: {
              lessonFrom:{
                select: {
                  course:{
                    select:{
                      name: true,
                      year: true
                    }
                  },
                  type: true,
                  shift: true
                }
              },
              lessonTo: {
                select: {
                  course:{
                    select:{
                      name: true,
                      year: true
                    }
                  },
                  type: true,
                  shift: true
                }
              }
            }
          }
        }
    })

    let new_cursor = 0; 
    trades.forEach((trade) =>{
      if(trade.id > new_cursor) new_cursor = trade.id;
    })

    return new NextResponse(JSON.stringify({response: trades, cursor: new_cursor}))
}