import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req, context) {
  const prisma = new PrismaClient();
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
    
  return new NextResponse(JSON.stringify({ profile:user_profile }));
}
  