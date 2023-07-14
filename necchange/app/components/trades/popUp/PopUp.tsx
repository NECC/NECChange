'use client'

import React, { useEffect, useState } from "react"
import Trades from "../trades/Trades";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PopUp {
    student_nr: string,
    handleTradesPopUp: () => void,
    isTradesOpened: boolean,
    classes: Array<any>
}

export interface Trade {
    fromUC: string,     // UC name             
    fromType: number,    // UC Type
    fromShift: number,   // UC Shift
    toUC: string, 
    toType: number,
    toShift: number,
    tradeID: number,
}

export default function PopUp(props: PopUp) {
    
    const {handleTradesPopUp, isTradesOpened, classes, student_nr} = props;
    const [tradeNumber, setTradeNumber] = useState(0);
    const [trades, setTrades] = useState<Array<Trade>>([]);
    const [ucNames, setUcNames] = useState([""]);

    const addTrade = () => {
        const newTrade = {
            fromUC: "",     // UC name             
            fromType: 0,    // UC Type
            fromShift: 0,   // UC Shift
            toUC: "", 
            toType: 0,
            toShift: 0,
            tradeID: tradeNumber,
        }
        setTradeNumber(tradeNumber + 1)
        setTrades([...trades, newTrade]);
    }

    useEffect(() =>{
        const getUcNames = () => {
            const uc_names = classes.map((uc_class) => uc_class.uc_name);
            // remove repeated ucs
            return Array.from(new Set(uc_names));
        }
        const ucNames = getUcNames();
        setUcNames(ucNames)
    }, [classes])

    //console.table(trades)

    return (
        <div className={`w-10/12 h-5/6 z-[51] absolute bg-slate-100  rounded-2xl left-1/2 -translate-x-1/2 top-24 ${isTradesOpened ? 'absolute' : 'hidden'} overflow-auto`}>

            <button onClick={handleTradesPopUp} className={`text-red-600 text-sm absolute right-0 px-3 py-1 m-3 mr-4 rounded-full border border-red-600 hover:text-white hover:bg-red-500 hover:border-white cursor-pointer transition-all`}>x</button>

            <div className="flex justify-center mt-4">
                <div className="flex-grow m-6 mx-16 w-11/12">
                    {
                        trades.map((trade) => (
                            <Trades key={trade.tradeID} trade={trade} trades={trades} setTrades={setTrades} ucNames={ucNames} student_nr={student_nr}/>
                        ))
                    }
                </div>
            </div>
            <button className="mr-14 absolute right-16 p-3 px-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-800" type="submit">Submit</button>
            <button onClick={addTrade} className="mr-16 absolute right-0 p-3 px-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-800 "><FontAwesomeIcon icon={faPlus} /></button>


        </div>


    );
}