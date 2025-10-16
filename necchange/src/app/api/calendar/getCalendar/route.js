import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "./public/data/input", "testes.json");

async function readData() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(filePath, "{}", "utf-8");
      return {};
    }
    throw err;
  }
}

async function writeData(data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("group");
  const allData = await readData();

  if (groupId) {
    return NextResponse.json({ response: { [groupId]: allData[groupId] || [] } });
  }
  return NextResponse.json({ response: allData });
}

export async function POST(req) {
  const data = await req.json();
  const { group, uc, day, type,start,end } = data;

  if (!group || !uc || !day || !type || !start || !end) {
    return NextResponse.json(
      { error: "Campos obrigatórios: group, uc, day, type" },
      { status: 400 }
    );
  }

  const allData = await readData();
  if (!allData[group]) allData[group] = [];
  
  allData[group].push({ uc, day, type,start,end });
  
  await writeData(allData);
  return NextResponse.json({ response: allData[group] });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const group = searchParams.get("group");
  const index = parseInt(searchParams.get("index"));

  if (!group || isNaN(index)) {
    return NextResponse.json(
      { error: "Parâmetros obrigatórios: group e index" },
      { status: 400 }
    );
  }

  const allData = await readData();
  
  if (!allData[group] || !allData[group][index]) {
    return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
  }

  const deleted = allData[group].splice(index, 1);
  await writeData(allData);
  
  return NextResponse.json({ response: deleted[0] });
}


/*import { PrismaClient } from "@prisma/client";
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
}*/
