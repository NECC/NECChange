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
