import {
    Dispatch,
    SetStateAction,
} from "react";
import UCFilter from "./Filters/UCFilter";

import NewTradeButton from '@/app/components/Feed/Sidebar/NewTrade/NewTradeButton'

interface FilterProps {
    setUcsFilter: Dispatch<SetStateAction<string[]>>,
    ucsArray: string[],
    ucsFilter: string[],
    student_nr: string
}

export default function Filters(props: FilterProps) {
    const { 
        setUcsFilter,
        ucsArray,
        ucsFilter,
        student_nr,
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
                <UCFilter setUcsFilter={setUcsFilter} ucsArray={ucsArray} ucsFilter={ucsFilter}/>
                <NewTradeButton student_nr={student_nr} />
            </div>
        )
}