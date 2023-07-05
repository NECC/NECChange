'use client' 

import React from "react"

export default function PopUp({handleTradesPopUp, isTradesOpened}) {
    return (
        <div className={`w-11/12 h-5/6 z-[51] absolute bg-slate-100 bg-opacity-95 rounded-2xl left-[4.5%] top-24 ${isTradesOpened ? 'absolute' : 'hidden'}`}>

            <button onClick={handleTradesPopUp} className={`text-red-600 text-2xl absolute right-0 p-1 px-3 m-3 mr-4 rounded-full border border-red-600 hover:text-white hover:bg-red-600 hover:border-white cursor-pointer transition-all`}>X</button>
            
        </div>
    );
}