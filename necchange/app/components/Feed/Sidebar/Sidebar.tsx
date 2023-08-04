import {
    Dispatch,
    SetStateAction,
} from "react";
import YearFilter from "./Filters/YearFilter";
import UCFilter from "./Filters/UCFilter";
import { FilterI } from "./interface";
import { UnidadesCurricularesI } from "@/app/feed/interface";

import NewTradeButton from '@/app/components/Feed/Sidebar/NewTrade/NewTradeButton'

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

    return (
            <div className=" px-10 mt-4 w-1/4 border-r">
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
                <NewTradeButton />
            </div>
        )
}