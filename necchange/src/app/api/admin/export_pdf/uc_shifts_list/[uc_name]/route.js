import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const type_class = {
  1: "T",
  2: "TP",
  3: "PL",
};

const prisma = new PrismaClient();

export async function GET(req, context) {

  const uc_name = context.params.uc_name;
  // course name param

  const uc_shifts = await prisma.lesson.groupBy({
    where: {
      course: {
        name: uc_name,
      },
    },
    by: ["course_id", "type", "shift"],

    orderBy: {
      course_id: "asc",
    },
  });
  let data = {};
  await Promise.all(
    uc_shifts.map(async (uc_shift) => {
      const query_students_list = await prisma.student_lesson.findMany({
        where: {
          lesson: {
            course_id: uc_shift.course_id,
            type: uc_shift.type,
            shift: uc_shift.shift,
          },
        },
        select: {
          User: {
            select: {
              number: true,
            },
          },
        },
      });

      let aux_student_list = [];
      await Promise.all(
        query_students_list.map(async (student) => {
          aux_student_list.push(student.User?.number);
        })
      );

      const students_array = Array.from(new Set(aux_student_list));
      const label = type_class[uc_shift.type] + uc_shift.shift;
      data[label] = students_array;
    })
  );

  await prisma.$disconnect()
  return new NextResponse(JSON.stringify({ data: data }));
}
