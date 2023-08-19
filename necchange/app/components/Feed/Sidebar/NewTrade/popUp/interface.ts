import { ClassesI } from "@/app/horario/interface"

export interface PopUpInterface {
    student_nr: string,
    handleTradesPopUp: () => void,
    isTradesOpened: boolean,
}

export interface TradesI {
    student_nr: string,
    ucNames: Array<string>,
    setTrades: (trades: TradeI[]) => void,
    trade: TradeI,
    trades: Array<TradeI>
}

export interface TradeI {
    fromUC: string,     // UC name             
    fromType: number,    // UC Type
    fromShift: number,   // UC Shift
    toUC: string, 
    toType: number,
    toShift: number,
    tradeID: number,
}
