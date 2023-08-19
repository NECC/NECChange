import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'

export async function GET(request: NextRequest, context: any){

  const student_nr = context.params.student_nr
  
  const prisma = new PrismaClient()
  const studentClasses: any = await prisma.user.findUnique({
      where: {
        number: student_nr,
      },
      select: {
        student_lesson: {
          select: {
            lesson: {
              select: {
                weekday: true,
                start_time: true,
                end_time: true,  
                local: true,
                shift: true,
                type: true,
                course: {
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


  let classes: any = [];
  studentClasses.student_lesson.map((studentClass: any) => {
    let date = new Date()
    let year = date.getFullYear()
    let month: any = date.getMonth() +1;

    if(month < 10) month = "0" + month;

    let days_in_month = new Date(year, month, 0).getDate();
    let day: any = date.getDate() + studentClass.lesson.weekday - date.getDay();

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

    let start = new Date(year + "-" + month + "-" + day + "T" + studentClass.lesson.start_time);
    let end = new Date(year + "-" + month + "-" + day + "T" + studentClass.lesson.end_time);

    let type_class: any = {
      1: "T",
      2: "TP",
      3: "PL"
    }

    let shift = studentClass.lesson.shift;
    let type: any = type_class[studentClass.lesson.type];
    let uc_name = studentClass.lesson.course.name;
    classes.push({
      title: uc_name + " - " + type + shift + " - " + studentClass.lesson.local,

      uc_name: uc_name,
      type: type,
      shift: shift,
      start: start,
      end: end
    })
  });

  return new NextResponse(JSON.stringify({response: classes}))
}