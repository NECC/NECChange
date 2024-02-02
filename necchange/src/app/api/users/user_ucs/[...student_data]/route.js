import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, context) {
  const student_nr = context.params.student_data[0];

  const student_classes_uc = await prisma.student_lesson.findMany({
    where: {
      User: {
        number: student_nr,
      },
    },
    select: {
      lesson: {
        select: {
          course: true,
        },
      },
    },
  });

  let student_ucs = [];

  student_classes_uc.map((student_class_uc) => {
    if (!student_ucs.includes(student_class_uc.lesson?.course?.name) && student_class_uc.lesson != null ) {
      student_ucs.push(student_class_uc.lesson?.course?.name);
    }
  });

  await prisma.$disconnect()
  return new NextResponse(JSON.stringify({ student_classes: student_ucs }));
}
