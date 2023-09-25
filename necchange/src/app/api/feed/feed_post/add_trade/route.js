import { PrismaClient, Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req, context) {
  const data = await req.json();
  const student_nr = data.params.student_nr;
  const trades = data.params.trades;
  const prisma = new PrismaClient();

  try {
    const student_id = await prisma.user.findFirst({
      where: {
        number: student_nr,
      },
      select: {
        uniqueId: true,
      },
    });

    const date = new Date();
    // create one entry on table trade
    if (student_id) {
      await prisma.$transaction(async (tx) => {
        const new_trade = await tx.trade.create({
          data: {
            from_student_id: student_id.uniqueId,
            status: Status.PENDING,
            publish_time: date,
          },
        });

        await Promise.all(
          trades.map(async (trade) => {
            const class_from_id = await tx.lesson.findMany({
              where: {
                course: {
                  id: trade.ucId,
                },
                type: trade.type,
                shift: trade.fromShift,
              },
              select: {
                id: true,
              },
            });

            const class_to_id = await tx.lesson.findMany({
              where: {
                course: {
                  id: trade.ucId,
                },
                type: trade.type,
                shift: trade.toShift,
              },
              select: {
                id: true,
              },
            });

            if (!student_id || !class_from_id || !class_to_id) {
              // Handle the case when student is null, such as returning an error response
              return new Error("error");
            } else {
              // get the autoincremented id
              const trade_id = new_trade.id;
              await Promise.all(
                class_from_id.map(async (class_from, i) => {
                  // create the needed switches
                  await tx.lesson_trade.create({
                    data: {
                      lesson_from_id: class_from.id,
                      lesson_to_id: class_to_id[i].id,
                      trade_id: trade_id,
                    },
                  });
                })
              );
            }
          })
        );
      });
    }

    return new NextResponse(JSON.stringify({ response: "Success" }));
  } catch (error) {
    return new Error("Error");
  }
}
