import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {
    const student_data = context.params.student_data;
    const prisma = new PrismaClient();

    let type_class: any = {
        1: "T",
        2: "TP",
        3: "PL"
    }
    const student_nr = student_data[0];
    const uc_name = student_data[1];

    // this query gets all classes of a student from a given uc
    const student_classes_uc = await prisma.student_lesson.findMany({
        where: {
            student:{
                number: student_nr
            },
            lesson:{

                course:{
                    name: uc_name
                }
            }
        },
        select:{
            lesson:{

                select: {
                    type: true,
                    shift: true
                }
            }
        }
    })

    let student_classes: any = {
        "T": [],
        "TP": [],
        "PL": []
    }

    student_classes_uc.map((student_class_uc) =>{
        if(student_class_uc.lesson?.type){
            let type = type_class[student_class_uc.lesson.type]
            student_classes[type].push(student_class_uc.lesson.shift)

        }
    })


    // this query gets all classes from a given uc
    const uc_shifts_query = await prisma.lesson.findMany({

        where:{
            course:{
                name: uc_name
            }
        },
        orderBy:{
            shift: 'asc'
        }
    })

    let uc_shifts: any = {
        "T": [],
        "TP": [],
        "PL": []
    }
    
    uc_shifts_query.map((uc_shift) =>{
        if(uc_shift.type){
            let type = type_class[uc_shift.type]
            uc_shifts[type].push(uc_shift.shift);
        }
    })
  
    return new NextResponse(JSON.stringify({uc_shifts: uc_shifts, student_classes: student_classes}))

}