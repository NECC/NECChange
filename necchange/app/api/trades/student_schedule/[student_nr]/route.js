import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'

export async function GET(request, context){

  const student_nr = context.params.student_nr
  
  const prisma = new PrismaClient()
  const studentClasses = await prisma.student.findUnique({
      where: {
        number: student_nr,
      },
      select: {
        student_class: {
          select: {
            uc_class: {
              select: {
                weekday: true,
                start_time: true,
                end_time: true,  
                local: true,
                shift: true,
                type: true,
                uc: {
                  select:{
                      name: true
                  }
                },
              },
            },
          },
        },
      },
    });


  let classes = [];
  studentClasses.student_class.map((studentClass) => {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() +1;

    if(month < 10) month = "0" + month;

    let days_in_month = new Date(year, month, 0).getDate();
    let day = date.getDate() + studentClass.uc_class.weekday - date.getDay();

    if (day > days_in_month) {
      day = day % days_in_month;
      month++;
      if (month < 10) {
        month = "0" + month;
      }
    }

    if (day <= 0) {
      month--;
      days_in_month = new Date(year, month, 0).getDate();
      day = (day % days_in_month) + days_in_month;
      if (month < 10) {
        month = "0" + month;
      }
    }

    if (day < 10) {
      day = "0" + day;
    }

    let start = new Date(year + "-" + month + "-" + day + "T" + studentClass.uc_class.start_time);
    let end = new Date(year + "-" + month + "-" + day + "T" + studentClass.uc_class.end_time);

    let type_class = {
      1: "T",
      2: "TP",
      3: "PL"
    }

    let shift = studentClass.uc_class.shift;
    let type = type_class[studentClass.uc_class.type];
    let uc_name = studentClass.uc_class.uc.name;
    classes.push({
      title: uc_name + " - " + type + shift + " - " + studentClass.uc_class.local,

      uc_name: uc_name,
      type: type,
      shift: shift,
      start: start,
      end: end
    })
  });

  return new NextResponse(JSON.stringify({response: classes}))
}