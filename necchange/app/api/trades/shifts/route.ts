import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {
  const prisma = new PrismaClient();
  const ucs = [...req.nextUrl.searchParams.values()].map(Number);

  const classes = await prisma.uc.findMany({
    where: {
      id: {
        in: ucs,
      },
    },
    select: {
      id: true,
      name: true,
      uc_class: {
        select: {
          id: true,
          type: true,
          shift: true,
        },
      },
    },
  });

  return new NextResponse(JSON.stringify({ classes }));
}
