import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {
  const student_nr = context.params.student_nr;
  const prisma = new PrismaClient();

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

    return new NextResponse(
      JSON.stringify({ status: "ok", student_ucs: student_ucs })
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: "error", error: error }));
  }
}
