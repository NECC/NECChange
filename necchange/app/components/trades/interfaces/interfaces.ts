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

// Classes properties
export interface ClassesI {
    title: string,
    uc_name: any
    shift: number,
    type: string,
    start: string,
    end: string,
}

// POPUP PROPS
export interface PopUpI {
    student_nr: string,
    handleTradesPopUp: () => void,
    isTradesOpened: boolean,
    classes: Array<any>
}

// FEED PROPS
export interface FeedPostsI {
    postsArray: Array<FeedPostI>
}


export interface FeedPostI {
    fromUC: string,     // UC name             
    fromType: number,    // UC Type
    fromShift: number,   // UC Shift
    toUC: string, 
    toType: number,
    toShift: number,
    tradeID: number,
    studentNumber: number,
    studentYear: number,
    displayName: string,
    timePassed: number,
    profilePic: string,
}