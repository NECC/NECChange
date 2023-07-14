'use client'

import React, { useState } from "react";
import axios from 'axios';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { Trade } from "../popUp/PopUp";

interface Trades {
    student_nr: string,
    ucNames: Array<string>,
    setTrades: (trades: Trade[]) => void,
    trade: Trade,
    trades: Array<Trade>
}

const types_class: any = {
    1: "T",
    2: "TP",
    3: "PL"
}

export default function Trades(props: Trades) {
    const { trade, trades, setTrades, ucNames, student_nr} = props

    const [inputMode, setInputMode] = useState(true);
    const [newTrade, setNewTrade] = useState({fromUC: "", fromType: 0,fromShift: 0, toUC: "", toType: 0, toShift: 0, tradeID: trade.tradeID});
    
    // [ [T], [TP], [PL]]
    const [allClasses, setAllClasses] = useState([[],[],[]])
    const [studentClasses, setStudentClasses] = useState([[],[],[]])

    const removeTrade = () => {
        const tradeID = trade.tradeID;
        const actualTrades = trades.filter((trade: Trade) => trade.tradeID != tradeID);
        setTrades(actualTrades);
    }

    const changeShiftInput = () => {
        setInputMode(!inputMode)
    }
    
    const submitChangesInput = () => {       
        const actualTrades = trades.map((trade) => {
            if (trade.tradeID === newTrade.tradeID) return newTrade;
            return trade;
        });
        
        setInputMode(!inputMode);
        setTrades(actualTrades);
    }

    const handleClickUcField = (ucName: string) => {
        setNewTrade({fromUC: ucName, fromType: 0,fromShift: 0, toUC: ucName, toType: 0, toShift: 0, tradeID: trade.tradeID})

        axios.get(`api/trades/shifts/${student_nr}/${ucName}`)
            .then( (response) =>{
                // here i get all classes from a given uc
                const newShifts = response.data.uc_shifts;
                const T_shifts = newShifts.T;
                const TP_shifts = newShifts.TP;
                const PL_shifts = newShifts.PL;
                setAllClasses([T_shifts, TP_shifts, PL_shifts]);
                
                // here i get all classes of a student from a given uc
                const newStudentClasses = response.data.student_classes;
                const T_classes = newStudentClasses.T;
                const TP_classes = newStudentClasses.TP;
                const PL_classes = newStudentClasses.PL;
                setStudentClasses([T_classes, TP_classes, PL_classes])
            }
        )        
        
    }
    
    const restore_data = () =>{
        setNewTrade({fromUC: "", fromType: 0,fromShift: 0, toUC: "", toType: 0, toShift: 0, tradeID: trade.tradeID})
        setAllClasses([[],[],[]]);
        setStudentClasses([[],[],[]]);
    }

    console.log(newTrade)
    return (

        <div className="group text-center bg-blue-500 p-6 rounded-2xl relative mt-2 w-full">
            <div className="text-white text-xl flex justify-between items-center">
                <select className="flex-1 truncate text-left font-popUp mx-2 bg-blue-400/50 p-3 rounded-xl outline-none hover:bg-blue-600">
                    <option onClick={restore_data}></option>
                    {
                        ucNames.map((ucName, index) => {
                            return(
                                <option key={index} onClick={() => handleClickUcField(ucName)}>
                                    {ucName}
                                </option>
                            )
                        })
                    }
                </select>
                -
                <select className="truncate text-left font-popUp mx-2 bg-blue-400/50 p-3 rounded-xl outline-none hover:bg-blue-600">
                    <option onClick={() => setNewTrade(prevTrade => ({...prevTrade, fromType: 0, fromShift: 0, toType: 0, toShift: 0}))}></option>
                    {
                        studentClasses.map( (type, index)  => {
                            return(
                                type.map((shift, id) =>{
                                    {
                                        return(
                                            <option key={id} onClick={() => setNewTrade(prevTrade => ({...prevTrade, fromType: index+1, fromShift: shift, toType: index+1}))}>
                                                {types_class[index+1]}{shift}
                                            </option>)
                                    }
                                })
                            )
                        })
                    }   
                </select>


                <div className="px-8 text-4xl"><FontAwesomeIcon icon={faArrowRight} size="lg" /></div>

                <select className="flex-1 truncate text-left font-popUp mx-2 bg-blue-400/50 p-3 rounded-xl outline-none hover:bg-blue-600" name="toUC" id="toUC">
                    <option className="p-3 truncate text-left font-popUp mx-2 bg-white text-black">
                        {newTrade.toUC}
                    </option>
                    
                </select>
                -
                <select className="truncate text-left font-popUp mx-2 bg-blue-400/50 p-3 rounded-xl outline-none hover:bg-blue-600" name="to" id="to">
                    <option value="" onClick={() => setNewTrade(prevTrade => ({...prevTrade, toShift: 0})) }></option>
                    {

                        allClasses.map((uc_class, index) =>{
                            if(newTrade.fromType != 0 && index+1 == newTrade.fromType){
                                return(
                                    uc_class.map((shift, id) =>{
                                        if(shift != newTrade.fromShift){
                                            return(
                                                <option key={id} onClick={() => setNewTrade(prevTrade => ({...prevTrade, toType: index+1, toShift: shift})) }>
                                                    {types_class[index+1]}{shift}
                                                </option>
                                            )
                                        }
                                    })

                                );
                            } else if(newTrade.fromType == 0){
                                return(
                                    uc_class.map((shift, id) =>{
                                        return(
                                            <option key={id} onClick={() => setNewTrade(prevTrade => ({...prevTrade, toType: index+1, toShift: shift})) }>
                                                {types_class[index+1]}{shift}
                                            </option>
                                        )
                                    })

                                );
                            }
                        })
                    }
                </select>
                <div onClick={submitChangesInput} className={`${inputMode ? "hidden" : ""} border border-green-500 text-green-400 p-2 ml-2 rounded-full cursor-pointer hover:bg-green-400 hover:text-black transition-all duration-300`}><FontAwesomeIcon icon={faCheck}/></div>
            </div>

            <div className={`${inputMode ? "" : "hidden"} flex bg-white/0 w-full h-full rounded-xl justify-end absolute right-0 top-1/2 -translate-y-1/2 pr-4 transition-all duration-150`}>
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