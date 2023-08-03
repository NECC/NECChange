import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {
    const student_nr = context.params.student_data[0];
    
    
    const prisma = new PrismaClient();
    // const student_nr = student_data[0];

    const student_classes_uc = await prisma.student_class.findMany({
        where: {
            student:{
                number: student_nr
            },
        },
        select:{
            uc_class:{
                select: {
                    uc: true,
                }
            }
        }
    })

    let student_ucs: any = []
    
    student_classes_uc.map((student_class_uc) =>{
        if(!student_ucs.includes(student_class_uc.uc_class?.uc?.name)){
            student_ucs.push(student_class_uc.uc_class?.uc?.name)
        }
    })
    


    return new NextResponse(JSON.stringify({student_classes: student_ucs}))
}