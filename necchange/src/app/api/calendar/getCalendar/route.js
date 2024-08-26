import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, res) {
  const avaliacoes_eventos = await prisma.dates.findMany();

  await prisma.$disconnect();
  return NextResponse.json({ response: avaliacoes_eventos });
}

export async function POST(req, res) {
  const data = await req.json();
  const { title, start, color } = data;

  const newDate = await prisma.dates.create({
    data: {
      title: title,
      start: start,
      color: color,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json({ response: newDate });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const deletedDate = await prisma.dates.delete({
    where: {
      id: parseInt(id),
    },
  });

  await prisma.$disconnect();
  return NextResponse.json({ response: deletedDate });
}
