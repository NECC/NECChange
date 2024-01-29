import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, context) {
  const uniqueId = parseInt(context.params.uniqueId)

  const user_profile = await prisma.user.findFirst({
    where:{
      uniqueId: uniqueId
    },
    select:{
      name: true,
      role: true,
      phone: true,
      partner: true,
      email: true
    }
  })
    
  await prisma.$disconnect()
  return new NextResponse(JSON.stringify({ profile:user_profile }));
}
  