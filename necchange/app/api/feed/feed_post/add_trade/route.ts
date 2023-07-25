import {Trade} from "@/app/api/feed/feed_post/add_trade/interface"
import { PrismaClient, Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, context: any){
    const data = await req.json()
    const student_nr = data.params.student_nr;
    const trades = data.params.trades
    
    const prisma = new PrismaClient();

    const student_id = await prisma.student.findFirst({
        where:{
            number: student_nr
        },
        select: {
            id:true 
        }
    })
    
    const date = new Date()
    // create one entry on table trade
    if(student_id){
        const new_trade = await prisma.trade.create({
            data:{
                from_student_id: student_id.id,
                status: Status.PENDING,
                publish_time: date,
            }
        })
    
        trades.map(async (trade: Trade) => {
            console.log(trade)

            const class_from_id = await prisma.uc_class.findMany({
                where:{
                    uc:{
                        name: trade.fromUC
                    },
                    type: trade.fromType,
                    shift: trade.fromShift
                },
                select: {
                    id: true
                }
            });

            const class_to_id = await prisma.uc_class.findMany({
                where:{
                    uc:{
                        name: trade.toUC
                    },
                    type: trade.toType,
                    shift: trade.toShift
                },
                select: {
                    id: true
                }
            });

            if (!student_id || !class_from_id || !class_to_id) {
                // Handle the case when student is null, such as returning an error response
                return new NextResponse(JSON.stringify({ error: "Not found" }));
            }else{

                // get the autoincremented id 
                const trade_id = new_trade.id;
                class_from_id.map(async (class_from, i) => {
                    // create the needed switches
                    await prisma.class_switch.create({
                        data:{
                            class_from_id: class_from.id,
                            class_to_id: class_to_id[i].id,
                            trade_id: trade_id
                        }
                    })
                })
            }
        })
    }

    return new NextResponse(JSON.stringify({response: "Success"}));
}