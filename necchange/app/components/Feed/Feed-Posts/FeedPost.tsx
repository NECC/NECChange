import React, {useState} from "react";

const type_class: any = {
    1: "T",
    2: "TP",
    3: "PL"
}

const yearColor = ['text-blue-500','text-red-500', 'text-green-600'];

export default function FeedPost({post}: any) {
    const [fromStudentNr, setFromStudentNr] = useState<string>(post.from_student.number)
    const [tradeId, setTradeId] = useState<number>(post.id);

    return (
        <div className="w-2/3 rounded-md text-lg bg-white p-8 m-4 ml-10 border shadow-md">
            <div className="font-bold pb-10">
                <div className="float-left text-2xl">
                    <span className="ml-1 text-lg font-normal">
                        <strong className="text-xl">{fromStudentNr}</strong>
                        - solicitou uma troca de turno da UC
                    </span>
                </div>
                <div className="text-end">
                    Publicado há ...
                </div>

            </div>
            {
                post.trade_id.map((lesson_trade: any, i: number) => {
                    let type = type_class[lesson_trade.lessonFrom.type]
                    let fromShift = lesson_trade.lessonFrom.shift
                    let toShift = lesson_trade.lessonTo.shift

                    //console.log(lesson_trade);
                    return(
                        <div key={i} className="flex flex-row">
                            <div className="font-bold">
                                {lesson_trade.lessonFrom.course.name}
                            </div>
                            <span className={`ml-1 font-bold ${yearColor[lesson_trade.lessonFrom.course.year - 1]}`}>
                                ( {lesson_trade.lessonFrom.course.year}º Ano )
                            </span>
                            <div className="ml-1">
                                {'- ' + type + fromShift + ' para ' + type + toShift}
                            </div>
                        </div>
                    );
                })
            }
            <div>
                <button className="p-2 mt-4 bg-[#018ccb] hover:bg-[#007cb6] font-bold text-white text-md float-right rounded-lg shadow-md">Aceitar Troca</button>
            </div>
        </div>
    );
}

