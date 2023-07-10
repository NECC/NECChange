'use client'

import React, { MutableRefObject, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Trade } from "../popUp/PopUp";

interface Trades {
    shift: Trade,
    setTrades: (trades: Trade[]) => void,
    trades: Trade[]
}

export default function Trades(props: Trades) {
    const { setTrades,shift,trades } = props
    const tradeRef = useRef<any>();

    const removeTrade = () => {
        const tradeID = tradeRef.current.id;
        const actualTrades = trades.filter((trade: Trade) => trade.tradeID != tradeID);
        setTrades(actualTrades);
    }


    return (
        <div className="group text-center bg-blue-500 p-6 rounded-lg relative mt-2 w-full" id={`${shift.tradeID}`} ref={tradeRef} >
            <div className="text-white text-2xl flex justify-between items-center">
                <div className="flex-1 truncate text-left font-popUp">{shift.fromUC}</div>
                <span className="font-popUp font-bold">- {shift.from} </span>

                <div className="px-8 text-4xl"><FontAwesomeIcon icon={faArrowRight} size="lg" /></div>

                <div className="flex-1 truncate text-left font-popUp">{shift.toUC}</div>
                <span className="font-popUp font-bold">- {shift.to}</span>
            </div>

            <div className="flex bg-white/0 w-full h-full rounded-xl justify-end absolute right-0 top-1/2 -translate-y-1/2 pr-4 group-hover:backdrop-blur-sm transition-all duration-150">
                <button className="text-4xl hidden group-hover:block px-4 py-1 rounded text-black/90">
                    <FontAwesomeIcon icon={faPencilAlt}  />
                </button>
                <button onClick={removeTrade} className="text-4xl hidden group-hover:block px-4 py-1 rounded text-black/90 hover:text-red-500">
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>


        </div>
    );
}