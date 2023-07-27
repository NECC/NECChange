import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {
    const student_nr = context.params.student_nr;
    const prisma = new PrismaClient();

    try {
        const student_ucs = await prisma.student_class.findMany({
            where:{
                student:{
                    number: student_nr
                }
            },
            
            select:{
                uc_class:{
                    select:{
                        uc:{
                            select:{
                                name:true
                            }
                        }
                    }
                }
            }
        })

        const ucs = new Set()
        student_ucs.map((uc) =>{
            ucs.add(uc.uc_class?.uc?.name)
        })
        const ucs_to_array = Array.from(ucs)
        return new NextResponse(JSON.stringify({status: "ok", ucs: ucs_to_array}))
    } catch(error) {
        return new NextResponse(JSON.stringify({status: "error", error: error}))
    }
}