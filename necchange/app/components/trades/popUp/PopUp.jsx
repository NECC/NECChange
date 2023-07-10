'use client'

import React from "react"

export default function PopUp({ handleTradesPopUp, isTradesOpened }) {
    return (
        <div className={`w-11/12 h-5/6 z-[51] absolute bg-slate-100 bg-opacity-95 rounded-2xl left-[4.5%] top-24 ${isTradesOpened ? 'absolute' : 'hidden'}`}>

            <button onClick={handleTradesPopUp} className={`text-red-600 text-2xl absolute right-0 p-1 px-3 m-3 mr-4 rounded-full border border-red-600 hover:text-white hover:bg-red-600 hover:border-white cursor-pointer transition-all`}>X</button>

            <div className="flex justify-center mt-24">
                <div className="flex-grow m-12">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="group text-center bg-blue-500 p-3 rounded-lg ">
                            turno pf
                            <div className="opacity-0 flex justify-end group-hover:opacity-100">
                                <button className="bg-green-500 text-white px-2 py-1 rounded">Botão 1</button>
                                <button className="bg-red-500 text-white px-2 py-1 rounded">Botão 2</button>
                            </div>
                        </div>
                        <div className="group text-center bg-blue-500 p-3 rounded-lg mt-1">
                            turno pi
                            <div className="opacity-0 group-hover:opacity-100 flex justify-end">
                                <button className="bg-green-500 text-white px-2 py-1 rounded">Botão 1</button>
                                <button className="bg-red-500 text-white px-2 py-1 rounded">Botão 2</button>
                            </div>
                        </div>
                        <div className="group text-center bg-blue-500 p-3 rounded-lg mt-1">
                            turno cp
                            <div className="opacity-0 group-hover:opacity-100 flex justify-end">
                                <button className="bg-green-500 text-white px-2 py-1 rounded">Botão 1</button>
                                <button className="bg-red-500 text-white px-2 py-1 rounded">Botão 2</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>


    );
}