import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, context) {
  const email = context.params.email;

  const student = await prisma.user.findFirst({
    where: {
      email: email,
    },
    select: {
      uniqueId: true,
    },
  });

  console.log(email);

  await prisma.$disconnect()
  if (student) {
    return new NextResponse(
      JSON.stringify({ response: "success", unique_id: student.uniqueId })
    );
  } else {
    return new NextResponse(JSON.stringify({ response: "error" }));
  }
}
