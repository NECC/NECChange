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
        <div className="w-full rounded-md text-lg bg-white p-4 pt-6 sm:p-8 my-3 border shadow-md flex flex-col relative">

            <div className="text-2xl leading-none text-justify mb-4 hidden sm:block">
                <span className="font-normal lg:text-lg text-base">
                    <strong>{fromStudentNr} </strong>
                    - solicitou uma troca de turno da UC <strong>Álgebra Universal e Categorias</strong>
                </span>
            </div>


            <div className="text-end text-sm absolute top-1 right-2 font-normal text-gray-400">
                Publicado há menos de 1 hora
            </div>


            <div className="block sm:hidden mb-4 leading-tight">
                <h1 className="text-xl font-bold">Solicitação de troca</h1>
                <span className="text-sm"><strong>Aluno:</strong> {fromStudentNr} </span> 
                <p className="text-sm"><strong>UC:</strong> Álgebra Universal e Categorias</p>

            </div>


            {
                post.trade_id.map((class_switch: any, i: number) => {
                    let type = type_class[class_switch.classFrom.type]
                    let fromShift = class_switch.classFrom.shift
                    let toShift = class_switch.classTo.shift

                    //console.log(class_switch);
                    return(
                        <div key={i} className="font-bold leading-tight lg:text-base text-sm">
                            {class_switch.classFrom.uc.name} <span className={`${yearColor[class_switch.classFrom.uc.year - 1]}`}> ({class_switch.classFrom.uc.year}º Ano ) </span> <p>{'Troca: ' + type + fromShift + ' para ' + type + toShift}</p>
                        </div>
                    );
                })
            }
            <div className="flex sm:justify-end justify-center mt-4">
                <button className="rounded-lg p-2 text-md mt-4 float-right font-bold text-white bg-[#018ccb] shadow-md hover:bg-[#007cb6]">Aceitar Troca</button>
            </div>
        </div>
    );
}

