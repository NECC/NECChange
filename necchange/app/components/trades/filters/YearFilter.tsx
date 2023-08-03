import { useState } from "react";
import { FiChevronDown } from 'react-icons/fi';
import { Dispatch, SetStateAction } from "react";
import { FilterI } from "./interface";

interface YearFilterProps {
    setFilter: Dispatch<SetStateAction<FilterI>>,
    filter: FilterI,
}

export default function YearFilter(props: YearFilterProps) {
    const { setFilter, filter } = props
    const years = [ "1°Ano", "2°Ano", "3°Ano"]


    // Open & Close Year Filter
    const [isVisible, setIsVisible] = useState(false);
    const toggleIsVisible = () => setIsVisible(!isVisible);

    // Filter state handler
    const changeFilterState = (e: any) => {

        const newFilter: any = {
            ...filter,
        }

        const trueKey = e.target.id;
        Object.keys(newFilter).forEach((key) => {
            if (key !== trueKey) {
                newFilter[key] = false;
            } else newFilter[key] = true;
        })

        setFilter(newFilter);
    }


    return (
        <div className="mb-4 border-y py-3">
            <div className="flex items-center justify-between cursor-pointer" onClick={toggleIsVisible}>
                <strong className="text-lg">Ano</strong>
                <span className="ml-2 cursor-pointer font-bold">
                    <FiChevronDown size={24} className={`transition-all duration-300 ${isVisible ? "rotate-180" : "rotate-0"}`}/>
                </span>
            </div>
            {isVisible && (
                <form className="mt-2 flex flex-col">
                    {years.map((year, index) => (
                        <div key={index} className="my-1 cursor-pointer">
                            <input type="radio" id={`ano${index+1}`} name="ano" value="ano" className="mr-1 my-1 h-[10px] cursor-pointer" onClick={changeFilterState}/>
                            <label htmlFor={`ano${index+1}`} className="mr-2 cursor-pointer text-md">{year}</label>
                        </div>
                    ))}
                </form>
            )}

        </div>
    );
}