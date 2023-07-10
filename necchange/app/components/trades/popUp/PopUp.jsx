'use client'

import React, { useState } from "react"
import Trade from '../../../components/trades/trade/Trade'
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function PopUp({ handleTradesPopUp, isTradesOpened }) {
    const [tradeNumber, setTradeNumber] = useState(0);
    const [trades, setTrades] = useState([]);

    const addTrade = () => {
        const newTrade = {
            from: "TP2",
            to: "TP1",
            fromUC: "Default 1", // UC name 
            toUC: "Default 2", // UC name
            tradeID: tradeNumber,
        }
        setTradeNumber(tradeNumber + 1)
        setTrades([...trades, newTrade]);
    }

    //console.table(trades)

    return (
        <div className={`w-10/12 h-5/6 z-[51] absolute bg-slate-100 bg-opacity-95 rounded-2xl left-1/2 -translate-x-1/2 top-24 ${isTradesOpened ? 'absolute' : 'hidden'} overflow-auto`}>

            <button onClick={handleTradesPopUp} className={`text-red-600 text-sm absolute right-0 p-1 px-3 m-3 mr-4 rounded-full border border-red-600 hover:text-white hover:bg-red-600 hover:border-white cursor-pointer transition-all`}>X</button>

            <div className="flex justify-center mt-4 ">
                <div className="flex-grow m-6 mx-16 w-11/12">

                    {
                        trades.map((trade) => (
                            <Trade key={trade.tradeID} shift={trade} setTrades={setTrades} trades={trades}/>
                        ))
                    }

                </div>
            </div>
            <button onClick={addTrade} className="mx-16 absolute right-0 p-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-800 border border-black"><FontAwesomeIcon icon={faPlus} /></button>


        </div>


    );
}