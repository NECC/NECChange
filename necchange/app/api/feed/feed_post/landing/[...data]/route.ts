import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Status } from "@prisma/client";

export async function GET(req: NextRequest, context: any) {
    const prisma = new PrismaClient();

    const limit = parseInt(context.params.data[0])
    let studentNr = context.params.data[1] === 'undefined' ? undefined : context.params.data[1]
    let ucsFilter = context.params.data.length === 3 ? context.params.data[2].split('&') : undefined

    let lesson_ids = undefined;
    if(ucsFilter != undefined){
      const query_lesson_ids = await prisma.lesson.findMany({
        where: {
          course: {
            name: {
              in: ucsFilter
            }
          }
        },
        select: {
          id: true
        }
      })

      lesson_ids = query_lesson_ids.map((lesson_id) => lesson_id.id)
    }

    const trades = await prisma.trade.findMany({
        where:{
          status: Status.PENDING,
          from_student:{
            number: studentNr
          },
          trade_id: {
            some:{
              lesson_from_id: {in: lesson_ids},
              lesson_to_id: {in: lesson_ids}
            }
          }
          
        },
        orderBy: {
          id: 'asc'
        },
        take: limit,
        include:{
          from_student:{
            select:{
              id: true,
              number: true
            }
          },
          trade_id: {
            select:{
              lessonFrom:{
                select:{
                  course: {
                    select:{
                      name: true,
                      year: true,
                    }
                  },
                  type: true,
                  shift: true
                },
                
              },
              lessonTo:{
                select:{
                  course: {
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