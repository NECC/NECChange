import UCFilter from "./Filters/UCFilter";
import NewTradeButton from '@/app/components/Feed/Sidebar/NewTrade/NewTradeButton'

interface FilterProps {
    setUcsFilter: Function,
    ucsArray: string[],
    ucsFilter: string[],
    student_nr: string | undefined,
    myTrades: boolean,
    setMyTrades: Function,
    toggleLoader: Function,
}

export default function Filters(props: FilterProps) {
    const { 
        setUcsFilter,
        ucsArray,
        ucsFilter,
        student_nr,
        myTrades,
        setMyTrades,
        toggleLoader,
    } = props

    return (
            <div className="px-10 mt-4 w-1/4 border-r h-auto">
                <div className="flex w-full font-semibold text-base">
                    <div className={`${myTrades ? 'bg-[#018ccb] hover:bg-[#018ccb] rounded-sm text-white' : ''} w-1/2 p-3 border-e flex justify-center transition duration-200
                                  hover:bg-[#018ccb] hover:text-white hover:rounded-sm hover:cursor-pointer`}
                         onClick={() => setMyTrades(true)}>
                        Minhas Trocas
                    </div>
                    <div className={`${myTrades ? '' : 'bg-[#018ccb] rounded-sm text-white'} w-1/2 p-3 flex justify-center transition duration-200
                                    hover:bg-[#018ccb] hover:text-white hover:rounded-sm hover:cursor-pointer`} 
                         onClick={() => setMyTrades(false)}> 
                        Trocas Gerais
                    </div>
                </div>
                <UCFilter setUcsFilter={setUcsFilter} ucsArray={ucsArray} ucsFilter={ucsFilter}/>
                <NewTradeButton student_nr={student_nr} toggleLoader={toggleLoader} />
            </div>
        )
}