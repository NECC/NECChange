import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req, context) {
  const prisma = new PrismaClient();
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

  if (student) {
    return new NextResponse(
      JSON.stringify({ response: "success", unique_id: student.uniqueId })
    );
  } else {
    return new NextResponse(JSON.stringify({ response: "error" }));
  }
}
