import { PrismaClient } from "@prisma/client";
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

  return NextResponse.json({ response: ucs });
}
