import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const prisma = new PrismaClient();
  const uniqueId = parseInt(context.params.uniqueId);


  await prisma.user.delete({ where: { uniqueId: uniqueId } });

  return new NextResponse(JSON.stringify({ status: "ok" }));
}
