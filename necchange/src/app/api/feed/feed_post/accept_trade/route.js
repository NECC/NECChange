import { PrismaClient, Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, context) {
  const data = await req.json();

  // student that accepted the trade
  const fromStudentNr = data.fromStudentNr;
  const studentNrAccepted = data.params.studentAcceptedNr;
  const tradeId = data.params.tradeId;


  const accept_query = await prisma.$transaction(async (tx) => {
    const getToStudentId = await tx.user.findFirst({
      where: {
        number: studentNrAccepted,
      },
      select: {
        uniqueId: true,
      },
    });

    const lessonsToTrade = await tx.trade.findUnique({
      where: {
        id: tradeId,
      },
      include: {
        trade_id: true,
      },
    });

    const fromStudentId = lessonsToTrade?.from_student_id;
    const toStudentId = getToStudentId?.uniqueId;

    if (lessonsToTrade?.status == Status.PENDING) {
      // verificar se o aluno tem os turnos opostos para poder realizar a troca
      let ableToTrade = true;
      await Promise.all(
        lessonsToTrade.trade_id.map(async (trade) => {
          const lessonToTrade = await tx.user.findFirst({
            where: {
              uniqueId: toStudentId,
            },

            include: {
              student_lesson: {
                where: {
                  lesson_id: trade.lesson_to_id,
                },
              },
            },
          });

          if (lessonToTrade?.student_lesson.length == 0) ableToTrade = false;
        })
      );

      // se os alunos têm os turnos opostos, realizar as trocas
      if (ableToTrade) {
        await Promise.all(
          lessonsToTrade.trade_id.map(async (trade) => {
            // I don't know why I cant use update instead of updateMany. uniqueId is an unique field
            const updateWhoRequested = await tx.student_lesson.updateMany({
              where: {
                User: {
                  uniqueId: fromStudentId,
                },
                lesson_id: trade.lesson_from_id,
              },
              data: {
                lesson_id: trade.lesson_to_id,
              },
            });

            const updateWhoAccepted = await tx.student_lesson.updateMany({
              where: {
                User: {
                  uniqueId: toStudentId,
                },
                lesson_id: trade.lesson_to_id,
              },
              data: {
                lesson_id: trade.lesson_from_id,
              },
            });
          })
        );

        await deleteDeprecatedTrades(fromStudentId, toStudentId, tradeId, tx);

        const closeTrade = await tx.trade.update({
          where: {
            id: tradeId,
          },
          data: {
            close_time: new Date(),
            to_student_id: toStudentId,
            status: Status.ACCEPTED,
          },
        });
        return true;
      }
    }

    return false;
  });

  return new NextResponse(JSON.stringify({ response: accept_query }));
}

async function deleteDeprecatedTrades(fromStudentId, toStudentId, tradeId, tx) {
  const classesTraded = await tx.trade.findUnique({
    where: {
      id: tradeId,
    },
    select: {
      trade_id: {
        select: {
          lesson_from_id: true,
          lesson_to_id: true,
        },
      },
    },
  });

  const lessonFromIds = classesTraded?.trade_id.map(
    (trade) => trade.lesson_from_id
  );
  const lessonToIds = classesTraded?.trade_id.map(
    (trade) => trade.lesson_to_id
  );

  const fromTrades = await tx.trade.findMany({
    where: {
      from_student_id: fromStudentId,
    },
    include: {
      trade_id: {
        where: {
          lesson_from_id: {
            in: lessonFromIds,
          },
        },
      },
    },
  });

  let idsToRemove = await removeTrades(fromTrades);
  await tx.trade.updateMany({
    where: {
      id: {
        in: idsToRemove,
      },
    },
    data: {
      close_time: new Date(),
      status: Status.REMOVED,
    },
  });

  const toTrades = await tx.trade.findMany({
    where: {
      from_student_id: toStudentId,
    },
    include: {
      trade_id: {
        where: {
          lesson_from_id: {
            in: lessonToIds,
          },
        },
      },
    },
  });

  idsToRemove = await removeTrades(toTrades);
  await tx.trade.updateMany({
    where: {
      id: {
        in: idsToRemove,
      },
    },
    data: {
      close_time: new Date(),
      status: Status.REMOVED,
    },
  });

  return new NextResponse(JSON.stringify({ response: true }));
}

async function removeTrades(trades) {
  let idsToRemove = [];
  Promise.all(
    trades.map(async (trade) => {
      if (trade.trade_id.length > 0) {
        idsToRemove.push(trade.id);
      }
    })
  );

  return idsToRemove;
}
