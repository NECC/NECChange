import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, context) {
  const student_nr = context.params.student_nr;

  try {
    const student_ucs = await prisma.student_lesson.findMany({
      where: {
        User: {
          number: student_nr,
        },
      },
      include: {
        lesson: {
          include: {
            course: true,
          },
        },
      },
    });

    const return_student_ucs = student_ucs.filter(student_uc => student_uc.lesson_id != null)

    return_student_ucs.map((bla) =>console.log(bla))

    await prisma.$disconnect()
    return new NextResponse(
      JSON.stringify({ status: "ok", student_ucs: return_student_ucs })
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: "error", error: error }));
  }
}
