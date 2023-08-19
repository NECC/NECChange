import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Status } from "@prisma/client";

const removeDuplicates = (post: any) =>{
  const filteredArray: any = []
  const seenObjects = new Set();

  post.map((trade: any) =>{
      const stringified = JSON.stringify(trade);
      if (!seenObjects.has(stringified)) {
          seenObjects.add(stringified);
          filteredArray.push(trade);
      }
  })

  return filteredArray
}

export async function GET(req: NextRequest, context: any) {
    const prisma = new PrismaClient();

    const limit = parseInt(context.params.data[0]);
    let studentNr = context.params.data[1] === 'undefined' ? undefined : context.params.data[1];
    let status = studentNr == undefined ? Status.PENDING : undefined
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
          status: status,
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
      trade.trade_id = removeDuplicates(trade.trade_id)
      if(trade.id > new_cursor) new_cursor = trade.id;
    })

    return new NextResponse(JSON.stringify({response: trades, cursor: new_cursor}))
}