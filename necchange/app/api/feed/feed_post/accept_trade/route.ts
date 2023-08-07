import { PrismaClient , Status} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: any) {
    const data = await req.json()

    // student that accepted the trade
    const studentNrAccepted = data.params.studentNr
    const tradeId = data.params.tradeId

    const prisma = new PrismaClient()

    const accept_query = await prisma.$transaction(async (tx) => {
        const studentIdAccepted = await tx.user.findFirst({
            where: {
                number: studentNrAccepted
            },
            select: {
                uniqueId: true
            }
        })

        const lessonsToTrade = await tx.trade.findUnique({
            where:{
                id: tradeId,
            },
            include:{
                trade_id: true
            }
        })

        const studentIdWhoRequested = lessonsToTrade?.from_student_id;
        
        if(lessonsToTrade?.status == Status.PENDING){
            // verificar se o aluno tem os turnos opostos para poder realizar a troca
            let ableToTrade = true;
            await Promise.all(lessonsToTrade.trade_id.map(async (trade)=>{
                const lessonToTrade = await tx.user.findFirst({
                    where:{
                        uniqueId: studentIdAccepted?.uniqueId
                    },

                    include:{
                        student_lesson: {
                            where:{
                                lesson_id: trade.lesson_to_id
                            }
                        }
                    }
                }) 
                
                if(lessonToTrade?.student_lesson.length == 0) ableToTrade = false;
            }))

            if(ableToTrade){
                await Promise.all(lessonsToTrade.trade_id.map(async (trade) => {
                    // I don't know why I cant use update instead of updateMany. uniqueId is an unique field
                    const updateWhoRequested = await tx.student_lesson.updateMany({
                        where:{
                            User:{
                                uniqueId: studentIdWhoRequested
                            },
                            lesson_id: trade.lesson_from_id
                        },
                        data:{
                            lesson_id: trade.lesson_to_id
                        }
                    })

                    const updateWhoAccepted = await tx.student_lesson.updateMany({
                        where:{
                            User:{
                                uniqueId: studentIdAccepted?.uniqueId
                            },
                            lesson_id: trade.lesson_to_id
                        },
                        data:{
                            lesson_id: trade.lesson_from_id
                        }
                    })
                }))

                const closeTrade = await tx.trade.update({
                    where: {
                        id: tradeId
                    },
                    data:{
                        close_time: new Date(),
                        to_student_id: studentIdAccepted?.uniqueId,
                        status: Status.ACCEPTED
                    }
                })
            } else { 
                return false
            }
        } else {
            return false
        }

        return true
    })

    return new NextResponse(JSON.stringify({response: accept_query}))

}

export async function DELETE(req: NextRequest, context: any) {
    const data = await req.json()

    // student that accepted the trade
    const fromStudentNr = data.fromStudentNr
    const toStudentNr = data.toStudentNr
    const tradeId = data.tradeId

    const prisma = new PrismaClient()

    const classesTraded = await prisma.trade.findUnique({
        where:{
            id: tradeId
        },
        select: {
            trade_id: {
                select: {
                    lesson_from_id: true,
                    lesson_to_id: true
                }
            }
        }
    })

    const fromStudentId = await prisma.user.findFirst({
        where:{
            number: fromStudentNr
        },
        select:{
            uniqueId:true
        }
    }) 

    const toStudentId = await prisma.user.findFirst({
        where:{
            number: toStudentNr
        },
        select:{
            uniqueId:true
        }
    }) 

    const lessonFromIds = classesTraded?.trade_id.map((trade) => trade.lesson_from_id)
    const lessonToIds = classesTraded?.trade_id.map((trade) => trade.lesson_to_id)


    const deleteTrades = await prisma.$transaction(async (tx) => {
        
        const fromTrades = await tx.trade.findMany({
            where: {
                from_student_id: fromStudentId?.uniqueId,
            },
            include:{
                trade_id:{
                    where: {
                        lesson_from_id: {
                            in: lessonFromIds
                        }
                    }
                }
            }
        })

        let idsToRemove = await removeTrades(fromTrades)
        await tx.trade.updateMany({
            where: {
                id:{
                    in: idsToRemove
                }
            },
            data:{
                close_time: new Date(),
                status: Status.REMOVED
            }
        })

        

        const toTrades = await tx.trade.findMany({
            where: {
                from_student_id: toStudentId?.uniqueId,
            },
            include:{
                trade_id:{
                    where: {
                        lesson_from_id: {
                            in: lessonToIds
                        }
                    }
                }
            }
        })

        idsToRemove = await removeTrades(toTrades)
        await tx.trade.updateMany({
            where: {
                id:{
                    in: idsToRemove
                }
            },
            data:{
                close_time: new Date(),
                status: Status.REMOVED
            }
        })
    })

    return new NextResponse(JSON.stringify({response: true}))
}

async function removeTrades(trades: any){
    let idsToRemove: any = []
    Promise.all(trades.map(async (trade: any) => {
        if(trade.trade_id.length > 0){
            idsToRemove.push(trade.id)
        }
    }))

    return idsToRemove;
}
