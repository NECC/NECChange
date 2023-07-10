'use client'

import React, { useState } from "react"
import Trade from '../../../components/trades/trade/Trade'


export default function PopUp({ handleTradesPopUp, isTradesOpened }) {

    const [trades, setTrades] = useState([]);

    const addTrade = () => {
        const newTrade = {
            from: "TP2",
            to: "TP1",
            fromUC: "Default 1",
            toUC: "Default 2",
        }
        setTrades([...trades, newTrade]);
        console.log(trades)
    }

    return (
        <div className={`w-10/12 h-5/6 z-[51] absolute bg-slate-100 bg-opacity-95 rounded-2xl left-1/2 -translate-x-1/2 top-24 ${isTradesOpened ? 'absolute' : 'hidden'} overflow-auto`}>

            <button onClick={handleTradesPopUp} className={`text-red-600 text-sm absolute right-0 p-1 px-3 m-3 mr-4 rounded-full border border-red-600 hover:text-white hover:bg-red-600 hover:border-white cursor-pointer transition-all`}>X</button>

            <div className="flex justify-center mt-4 ">
                <div className="flex-grow m-6 mx-16 w-11/12">
                    <Trade />
                    <Trade />
                    <Trade />
                </div>
            </div>
            <button onClick={addTrade} className="mx-16 absolute right-0">Add</button>


        </div>


    );
}