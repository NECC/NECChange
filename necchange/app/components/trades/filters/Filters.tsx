import {
    useState,
    Dispatch,
    SetStateAction,
} from "react";
import YearFilter from "./YearFilter";
import UCFilter from "./UCFilter";
import { FilterI } from "./interface";
import { UnidadesCurricularesI } from "@/app/feed/interface";

interface FilterProps {
    setYearFilter: Dispatch<SetStateAction<FilterI>>,
    setUcsFilter: Dispatch<SetStateAction<UnidadesCurricularesI>>,
    yearFilter: FilterI,
    ucsArray: string[],
    ucsFilter: UnidadesCurricularesI,
}

export default function Filters(props: FilterProps) {
    const { 
        yearFilter,
        setYearFilter,
        setUcsFilter,
        ucsArray,
        ucsFilter,
    } = props

    // Debug code
    //console.table(yearFilter)
    //console.table(ucsFilter)


    return (
            <div className="px-10 mt-4 w-1/4 border-r hidden lg:block">
                <div className="flex w-full font-bold">
                    <div className="w-1/2 p-3 border-e flex justify-center hover:bg-slate-50 hover:cursor-pointer">
                        My Trades
                    </div>
                    <div className="w-1/2 p-3 flex justify-center hover:bg-slate-50 hover:cursor-pointer">
                        All Trades
                    </div>
                </div>
                <YearFilter setFilter={setYearFilter} filter={yearFilter}/>
                <UCFilter setUcsFilter={setUcsFilter} ucsArray={ucsArray} ucsFilter={ucsFilter}/>
            </div>
        )
}