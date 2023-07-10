'use client'

import React, { MutableRefObject, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
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

    const fromUC = useRef<any>();
    const toUC = useRef<any>();     // change <any> later :)
    const from = useRef<any>();
    const to = useRef<any>();

    const tradeRef = useRef<any>();

    const [inputMode, setInputMode] = useState(true);
    const [] = useState({});

    const removeTrade = () => {
        const tradeID = tradeRef.current.id;
        const actualTrades = trades.filter((trade: Trade) => trade.tradeID != tradeID);
        setTrades(actualTrades);
    }

    const changeShiftInput = () => {
        setInputMode(!inputMode)
    }
    
    const submitChangesInput = () => {
        const tradeID = tradeRef.current.id;
        
        const newTrade: Trade = {
            from: from.current.value,
            to: to.current.value,
            fromUC: fromUC.current.value,
            toUC: toUC.current.value,
            tradeID: Number(tradeID)
        }
        
        const actualTrades = trades.map((trade) => {
            if (trade.tradeID === newTrade.tradeID) return newTrade;
            return trade;
        });
        
        setInputMode(!inputMode);
        setTrades(actualTrades);
        console.table(trades);
    }

    return (

        <div className="group text-center bg-blue-500 p-6 rounded-lg relative mt-2 w-full" id={`${shift.tradeID}`} ref={tradeRef} >
            <div className="text-white text-2xl flex justify-between items-center">
                <select ref={fromUC} className="flex-1 truncate text-left font-popUp mx-2 bg-blue-400/50 p-3 rounded-xl outline-none hover:bg-blue-600" name="fromUC" id="fromUC">
                    <option className="p-3 truncate text-left font-popUp mx-2 bg-white text-black" value=""></option>
                    <option className="p-3 truncate text-left font-popUp mx-2 bg-white text-black" value="Sistemas de Computação">Sistemas de Computação</option>
                    <option className="p-3 truncate text-left font-popUp mx-2 bg-white text-black" value="Álgebra Linear">Álgebra Linear</option>
                    <option className="p-3 truncate text-left font-popUp mx-2 bg-white text-black" value="Matemática Discreta">Matemática Discreta</option>
                </select>
                -
                <select ref={from} className="truncate text-left font-popUp mx-2 bg-blue-400/50 p-3 rounded-xl outline-none hover:bg-blue-600" name="from" id="from">
                    <option value=""></option>
                    <option value="TP-1">TP-1</option>
                    <option value="TP-2">TP-2</option>
                    <option value="TP-3">TP-3</option>
                </select>


                <div className="px-8 text-4xl"><FontAwesomeIcon icon={faArrowRight} size="lg" /></div>

                <select ref={toUC} className="flex-1 truncate text-left font-popUp mx-2 bg-blue-400/50 p-3 rounded-xl outline-none hover:bg-blue-600" name="toUC" id="toUC">
                    <option unselectable="on" className="p-3 truncate text-left font-popUp mx-2 bg-white text-black" value=""></option>
                    <option className="p-3 truncate text-left font-popUp mx-2 bg-white text-black" value="Sistemas de Computação">Sistemas de Computação</option>
                    <option className="p-3 truncate text-left font-popUp mx-2 bg-white text-black" value="Álgebra Linear">Álgebra Linear</option>
                    <option className="p-3 truncate text-left font-popUp mx-2 bg-white text-black" value="Matemática Discreta">Matemática Discreta</option>
                </select>
                -
                <select ref={to} className="truncate text-left font-popUp mx-2 bg-blue-400/50 p-3 rounded-xl outline-none hover:bg-blue-600" name="to" id="to">
                    <option value=""></option>
                    <option value="TP-1">TP-1</option>
                    <option value="TP-2">TP-2</option>
                    <option value="TP-3">TP-3</option>
                </select>

                <div onClick={submitChangesInput} className={`${inputMode ? "hidden" : ""} border border-green-500 text-green-400 p-2 ml-2 rounded-full cursor-pointer hover:bg-green-400 hover:text-black transition-all duration-300`}><FontAwesomeIcon icon={faCheck}/></div>

            </div>




            <div className={`${inputMode ? "" : "hidden"} flex bg-white/0 w-full h-full rounded-xl justify-end absolute right-0 top-1/2 -translate-y-1/2 pr-4 group-hover:backdrop-blur-sm transition-all duration-150`}>
                <button onClick={changeShiftInput} className="text-4xl hidden group-hover:block px-4 py-1 rounded text-black/90 hover:text-green-500">
                    <FontAwesomeIcon icon={faPencilAlt}  />
                </button>
                <button onClick={removeTrade} className="text-4xl hidden group-hover:block px-4 py-1 rounded text-black/90 hover:text-red-500">
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>


        </div>
    );
}