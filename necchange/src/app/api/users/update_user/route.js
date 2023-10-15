import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const prisma = new PrismaClient();
  console.log(context);



  return new NextResponse(JSON.stringify({ status: "ok"}));
}
