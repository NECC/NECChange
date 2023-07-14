'use client'
import { TradeI } from "@/app/components/trades/interfaces/interfaces";

export default function Feed() {

    /* Class types */
    // 1 -> T
    // 2 -> TP
    // 3 -> PL

    const feedData: Array<TradeI> = [
        {
            fromUC: "Laboratórios de Algoritmia I",     // UC name             
            fromType: 2,    // UC Type
            fromShift: 1,   // UC Shift
            toUC: "Laboratórios de Algoritmia I", 
            toType: 2,
            toShift: 1,
            tradeID: 1,
        },
        {
            fromUC: "Sistemas de Computação",     // UC name             
            fromType: 3,    // UC Type
            fromShift: 2,   // UC Shift
            toUC: "Sistemas de Computação", 
            toType: 3,
            toShift: 1,
            tradeID: 2,
        },
        {
            fromUC: "Matemática Discreta",     // UC name             
            fromType: 1,    // UC Type
            fromShift: 1,   // UC Shift
            toUC: "Matemática Discreta", 
            toType: 1,
            toShift: 2,
            tradeID: 3,
        },
        {
            fromUC: "Programação Funcional",     // UC name             
            fromType: 2,    // UC Type
            fromShift: 1,   // UC Shift
            toUC: "Programação Funcional", 
            toType: 2,
            toShift: 2,
            tradeID: 4,
        },
        {
            fromUC: "Programação Orientada a Objetos",     // UC name             
            fromType: 3,    // UC Type
            fromShift: 3,   // UC Shift
            toUC: "Programação Orientada a Objetos", 
            toType: 3,
            toShift: 1,
            tradeID: 5,
        },
    ]

    return (
        <div className="pt-24 h-screen">
            <h1>Aqui fica o feed</h1>
        </div>
    );
}