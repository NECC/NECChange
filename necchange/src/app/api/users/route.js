import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import axios from "axios";

/* Get all users*/
export async function GET(req, context) {
  const prisma = new PrismaClient();

  const users = await prisma.user.findMany({
    select: {
      uniqueId: true,
      partnerNumber: true,
      number: true,
      name: true,
      email: true,
      phone: true,
      partner: true,
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

/* Add a user */
export async function POST(req, context) {
  const prisma = new PrismaClient();
  const data = await req.json();
  const is_partner = data.params.partner == true ? true : false;

  const lastPartnerNumber = await prisma.user.findFirst({
    where: {
      partnerNumber: {
        not: null,
      },
    },
    select: {
      partnerNumber: true,
    },
    orderBy: {
      partnerNumber: "desc",
    },
  });

  const lastUniqueId = await prisma.user.findFirst({
    select: {
      uniqueId: true,
    },
    orderBy: {
      uniqueId: "desc",
    },
  });

  const newUser = await prisma.user.create({
    data: {
      uniqueId: lastUniqueId.uniqueId + 1,
      partnerNumber: lastPartnerNumber.partnerNumber + 1,
      number: data.params.number,
      name: data.params.name,
      email: data.params.email,
      phone: data.params.phone,
      role: data.params.role,
      partner: is_partner,
    },
  });

  let sheet_error = false;

  if (is_partner) {
    const new_date = new Date();
    await axios
      .post(
        `https://sheetdb.io/api/v1/${process.env.NEXT_PUBLIC_SHEETDB_ID}`,
        {
          data: [
            {
              "": "1",
              Nº: "INCREMENT",
              Nome: newUser.name,
              Numero: newUser.number,
              "Data de Admissão": new_date.toLocaleString(),
              Pago: 10,
              Telefone: newUser.phone,
              Email: newUser.email,
              Vitalício: "TRUE",
              Cartão: "FALSE",
            },
          ],
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization:
              "Basic " +
              btoa(
                `${process.env.NEXT_PUBLIC_SHEETDB_LOGIN}:${process.env.NEXT_PUBLIC_SHEETDB_PASSWORD}`
              ),
          },
        }
      )
      .then((res) => {
        console.log("Ok");
      })
      .catch((err) => {
        sheet_error = true;
        console.log("Erro");
      });
  }

  return new NextResponse(JSON.stringify({ sheet_error: sheet_error }));
}

/* Update user */
export async function PUT(req, context) {
  const prisma = new PrismaClient();
  const data = await req.json();

  const userId = parseInt(data.params.userId);
  const userProfile = data.params.userProfile;

  const is_partner = userProfile.partner == "true" ? true : false;

  await prisma.user.updateMany({
    where: {
      uniqueId: userId,
    },
    data: {
      name: userProfile.name,
      role: userProfile.role,
      phone: userProfile.phone,
      partner: is_partner,
      email: userProfile.email,
    },
  });

  return new NextResponse(JSON.stringify({ response: "error" }));
}
