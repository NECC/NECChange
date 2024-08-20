import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

const removeDuplicates = (post) => {
  const filteredArray = [];
  const seenObjects = new Set();

  post.map((trade) => {
    const stringified = JSON.stringify(trade);
    if (!seenObjects.has(stringified)) {
      seenObjects.add(stringified);
      filteredArray.push(trade);
    }
  });

  return filteredArray;
};

export async function GET(req, context) {
  const limit = parseInt(context.params.scroll[0]);
  const skip = context.params.scroll[1] === "landing" ? 0 : 1;
  const cursor =
    context.params.scroll[1] === "landing"
      ? undefined
      : { id: parseInt(context.params.scroll[1]) };
  let studentNr =
    context.params.scroll[2] === "undefined"
      ? undefined
      : context.params.scroll[2];
  let status = studentNr == undefined ? Status.PENDING : undefined;
  let ucsFilter =
    context.params.scroll.length === 4
      ? context.params.scroll[3].split("&")
      : undefined;

  let lesson_ids = undefined;

  if (ucsFilter != undefined) {
    const query_lesson_ids = await prisma.lesson.findMany({
      where: {
        course: {
          name: {
            in: ucsFilter,
          },
        },
      },
      select: {
        id: true,
      },
    });

    lesson_ids = query_lesson_ids.map((lesson_id) => lesson_id.id);
  }

  console.log("status", status);
  const trades = await prisma.trade.findMany({
    where: {
      status: status,
      from_student: {
        number: studentNr,
      },
      
      trade_id: {
        some: {
          lesson_from_id: { in: lesson_ids },
          lesson_to_id: { in: lesson_ids },
        },
      },
    },
    cursor: cursor,
    take: limit,
    skip: skip,
    orderBy: {
      publish_time: "asc",
    },

    include: {
      from_student: {
        select: {
          id: true,
          number: true,
        },
      },
      trade_id: {
        select: {
          lessonFrom: {
            select: {
              course: {
                select: {
                  name: true,
                  year: true,
                },
              },
              type: true,
              shift: true,
            },
          },
          lessonTo: {
            select: {
              course: {
                select: {
                  name: true,
                  year: true,
                },
              },
              type: true,
              shift: true,
            },
          },
        },
      },
    },
  });

  let new_cursor = 0;
  trades.forEach((trade) => {
    trade.trade_id = removeDuplicates(trade.trade_id);
    if (trade.id > new_cursor) new_cursor = trade.id;
  });

  await prisma.$disconnect()
  return new NextResponse(
    JSON.stringify({ response: trades, cursor: new_cursor })
  );
}
