import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, context) {
  const ucs = [...req.nextUrl.searchParams.values()].map(Number);

  const classes = await prisma.course.findMany({
    where: {
      id: {
        in: ucs,
      },
    },
    select: {
      id: true,
      name: true,
      lesson: {
        select: {
          id: true,
          type: true,
          shift: true,
        },
      },
    },
  });

  await prisma.$disconnect()
  return new NextResponse(JSON.stringify({ classes }));
}
