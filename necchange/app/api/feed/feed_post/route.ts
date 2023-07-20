import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Status } from "@prisma/client";

export async function POST(req: NextRequest, context: any){
    const data = await req.json()
    const student_nr = data.params.student_nr;
    const trade = data.params.trade
    
    const prisma = new PrismaClient();

    console.log(trade)

    const class_from_id = await prisma.renamedclass.findMany({
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

    const class_to_id = await prisma.renamedclass.findMany({
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

    const student_id = await prisma.student.findFirst({
        where:{
            number: student_nr
        },
        select: {
            id:true 
        }
    })

    if (!student_id || !class_from_id || !class_to_id) {
        // Handle the case when student is null, such as returning an error response
        return new NextResponse(JSON.stringify({ error: "Not found" }));
    }else{
        const date = new Date()

        class_from_id.map(async (class_from, i) => {
            const new_switch = await prisma.renamedswitch.create({
                data:{
                    from_student_id: student_id.id,
                    class_from_id: class_from.id,
                    class_to_id: class_to_id[i].id,
                    status: Status.PENDING,
                    publish_time: date,
                }
            })
        })

        return new NextResponse(JSON.stringify({response: "Success"}));
    }
}