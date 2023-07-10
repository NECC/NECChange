import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: any, res: any) {
    const prisma = new PrismaClient();
    const ucs = await prisma.uc.findMany({
        select: {
            name: true,
            year: true,
            semester: true,
        },
    });

    return NextResponse.json({ response: ucs });
}
