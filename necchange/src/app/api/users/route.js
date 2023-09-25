import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req, context) {
  const prisma = new PrismaClient();

  const users = await prisma.user.findMany({
    select: {
      uniqueId: true,
      number: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
    },
  });

  if (users) {
    return new NextResponse(
      JSON.stringify({ response: "success", users: users })
    );
  } else {
    return new NextResponse(JSON.stringify({ response: "error" }));
  }
}
