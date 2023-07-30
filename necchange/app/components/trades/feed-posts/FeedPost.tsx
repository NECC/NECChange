import React, { useEffect, useState } from "react";
import { FiChevronRight } from 'react-icons/fi';
import { FeedPostI, UnidadesCurricularesI } from "@/app/feed/interface";
import { FilterI } from "../filters/interface";


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
                post.trade_id.map((class_switch: any, i: number) => {
                    let type = type_class[class_switch.classFrom.type]
                    let fromShift = class_switch.classFrom.shift
                    let toShift = class_switch.classTo.shift

                    //console.log(class_switch);
                    return(
                        <div key={i} className="flex flex-row">
                            <div className="font-bold">
                                {class_switch.classFrom.uc.name}
                            </div>
                            <span className={`ml-1 font-bold ${yearColor[class_switch.classFrom.uc.year - 1]}`}>
                                ( {class_switch.classFrom.uc.year}º Ano )
                            </span>
                            <div className="ml-1">
                                {'- ' + type + fromShift + ' para ' + type + toShift}
                            </div>
                        </div>
                    );
                })
            }
            <div>
                <button className="rounded-lg p-2 text-md mt-4 float-right font-bold text-white bg-[#018ccb] shadow-md hover:bg-[#007cb6]">Aceitar Troca</button>
            </div>
        </div>
    );
}

