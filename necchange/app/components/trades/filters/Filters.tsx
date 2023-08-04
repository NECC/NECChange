import {
    useState,
    Dispatch,
    SetStateAction,
} from "react";
import UCFilter from "./UCFilter";

interface FilterProps {
    setUcsFilter: Dispatch<SetStateAction<string[]>>,
    ucsArray: string[],
    ucsFilter: string[],
}

export default function Filters(props: FilterProps) {
    const { 
        setUcsFilter,
        ucsArray,
        ucsFilter,
    } = props

    // Debug code
    //console.table(yearFilter)
    //console.table(ucsFilter)


    return (
            <div className="px-10 mt-4 w-1/4 border-r">
                <div className="flex w-full font-bold">
                    <div className="w-1/2 p-3 border-e flex justify-center hover:bg-slate-50 hover:cursor-pointer">
                        My Trades
                    </div>
                    <div className="w-1/2 p-3 flex justify-center hover:bg-slate-50 hover:cursor-pointer">
                        All Trades
                    </div>
                </div>
                <UCFilter setUcsFilter={setUcsFilter} ucsArray={ucsArray} ucsFilter={ucsFilter}/>
            </div>
        )
}