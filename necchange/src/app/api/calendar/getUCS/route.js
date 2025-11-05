import { PrismaClient } from "@prisma/client";
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, res) {
  const ucs = await prisma.course.findMany({
    select: {
      id: true,
      name: true,
      year: true,
      semester: true,
    },
  });

  await prisma.$disconnect()
  return NextResponse.json({ response: ucs });
}
