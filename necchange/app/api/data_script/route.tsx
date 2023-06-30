import type {NextApiRequest, NextApiResponse}
from "next";
import DBClient from "../client";
import {NextResponse} from "next/server";
import data from "../../info/schedule.json";
import data_students from "../../info/alocations.json";

const prisma = DBClient.getInstance().prisma;
type Data = {};

export async function POST(req: NextApiRequest, res: NextApiResponse<Data>) {
    const weekdays = [
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta"
    ];
    const class_types = ["T", "TP", "PL"];
    const classes: Array<string> = [];

    // Uc and class tables

    let i = 0;
    let id_counter = 1;
    let counter = 0;
    while (i < data.length) {
    if (classes.indexOf(data[i].uc) == -1) {
        const savedData = await prisma.uc.create({
          data: {
            id: id_counter,
            name: data[i].uc,
            year: Number(data[i].year),
            semester: Number(data[i].semester),
          },
        });
        classes.push(data[i].uc);
        id_counter++;
    }
    let j = 0;
    while (j < data[i].slots.length) {
        let hour = Number(data[i].slots[j][1]) + 1
        let min = Number(data[i].slots[j][2])
        let date: Date = new Date(2023, 0o6, 0o2, hour, min, 0, 0);
        const savedData_class = await prisma.renamedclass.create({
          data: {
            id: counter + 1,
            uc_id: classes.indexOf(data[i].uc) + 1,
            weekday: weekdays.indexOf(data[i].slots[j][0]),
            start_time: date,
            local: data[i].slots[j][5],
            type: class_types.indexOf(data[i].type_class),
            shift: Number(data[i].shift),
          },
        });
        j++;
        counter++;
    }
    j = 0;
    i++;
    }

    // Student Table

    const students = Object.keys(data_students[0]);

    i = 0;
    while(i < students.length){

    const savedData = await prisma.student.create({
        data: {
          id: i + 1,
          number: Number(students[i].substring(1)),
          firstname: "Primeiro",
          lastname: "Último",
          email: students[i] + "@alunos.uminho.pt",
          password: "****",
          is_admin: false,
        },
    });
    i++
    }

    // Student_Class table
    
    let t = 0;
    counter = 0;
    while (t < students.length) {
        let i = 0;

        const id_student = await prisma.student.findMany({
            where: {
                number: Number(students[t].substring(1))
            }
        });

        while (i < data_students[0][students[t] as keyof(typeof data_students)[0]].length) {
            let j = 0; 
            while (j < data_students[0][students[t] as keyof(typeof data_students)[0]][i].slots.length) {
                
                const id_uc = await prisma.uc.findMany({
                    where: {
                        name: data_students[0][students[t] as keyof(typeof data_students)[0]][i].uc
                    }
                });
                let h = Number(data_students[0][students[t] as keyof(typeof data_students)[0]][i].slots[j][1]) + 1;
                let m = Number(data_students[0][students[t] as keyof(typeof data_students)[0]][i].slots[j][2]);
                let date = new Date(1970, 0o0, 0o1, h, m, 0, 0);
                const id_class = await prisma.renamedclass.findMany({
                    where: {
                        uc_id: id_uc[0].id,
                        type: class_types.indexOf(data_students[0][students[t] as keyof(typeof data_students)[0]][i].type_class),
                        //shift: Number(data_students[0][students[0] as keyof(typeof data_students)[0]][i].shift),
                        start_time: date
                    }
                });

                const savedData = await prisma.student_class.create({
                    data: {
                        id: counter + 1,
                        student_id: id_student[0].id,
                        class_id: id_class[0].id
                    }
                });

                j++;
                counter++;
            }
            i++;
        }
        t++;
    }

    return NextResponse.json("savedData");
}
