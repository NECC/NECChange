import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  const prisma = new PrismaClient();
  const ucs = await prisma.course.findMany({
    select: {
      id: true,
      name: true,
      year: true,
      semester: true,
    },
  });

  return NextResponse.json({ response: ucs });
}
