import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const type_class = {
    1: "T",
    2: "TP",
    3: "PL",
  };
  
export async function GET(req, context) {
    var fs = require("fs");
    const ucs = await prisma.course.findMany({
        select: {
            name: true
        }
    })

    const folderPath = 'public/data/output'
    fs.mkdirSync(folderPath)

    ucs.map(async (uc) => {
        const students_of_uc =  await prisma.student_lesson.findMany({
            where:{
                lesson: {
                    course: {
                        name: uc.name
                    }
                }
            },
            select: {
                User: {
                    select: {
                        number: true
                    }
                },
                lesson: {
                    select: {
                        type: true,
                        shift: true
                    }
                }
            },
            orderBy: {
                lesson: {
                    shift: 'asc'
                }
            }
        })

        let shifts = new Set()
        if(students_of_uc.length != 0){
            let data_alunos = ""
            const uc_folder = folderPath + "/" + uc.name
            fs.mkdirSync(uc_folder)
            students_of_uc.map((student) => {
                const number = student.User.number.toLowerCase()
                const number_format = "," + "\"" + number + "\""
                if(student.lesson.type != 1){    
                    data_alunos += "\"" + uc.name + "-" + type_class[student.lesson.type] + student.lesson.shift + number_format + number_format + number_format + "," + "\".\"\n" 
                    shifts.add(type_class[student.lesson.type] + student.lesson.shift)
                }
                
            })
            fs.writeFileSync(uc_folder+ "/" + uc.name + "_alunos", data_alunos)
            
            let data_shifts = ""
            let blank = "\"\","
            shifts.forEach((shift) => {
                data_shifts += "\"" + uc.name + "-" +shift + "\"," +  "\"" + uc.name + "-" + shift + "\"," + blank + blank + "S," + blank + "N," + blank + blank + blank + blank +"\"\"\n" 
            })
            fs.writeFileSync(uc_folder+ "/" + uc.name + "_turnos", data_shifts)
        }
    })

    return new NextResponse(JSON.stringify({ data: ucs }));  
}