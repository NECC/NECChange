import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any){
    const prisma = new PrismaClient();
    const studentNr = context.params.number
    
    console.log(studentNr);
    const student = await prisma.student.findFirst({
        where: {
            number: studentNr
        },
        select:{
            id: true
        }
    })

    if(student){
        return new NextResponse(JSON.stringify({response: "success"}))
    } else {
        return new NextResponse(JSON.stringify({response: "error"}))
    }

}