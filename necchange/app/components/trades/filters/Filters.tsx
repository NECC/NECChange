import {
    useState,
    Dispatch,
    SetStateAction,
} from "react";

import YearFilter from "./YearFilter";
import UCFilter from "./UCFilter";
import { FilterI } from "./interface";

interface FilterProps {
    setFilter: Dispatch<SetStateAction<FilterI>>,
    filter: FilterI,
}

export default function Filters(props: FilterProps) {
    const { 
        filter,
        setFilter
    } = props

    const [isUCFormVisible, setIsUCFormVisible] = useState(false);
    const [isopen, setIsopen] = useState(false);

    const toggleUCFormVisibility = () => {
        setIsUCFormVisible(!isUCFormVisible);
        setIsopen(!isopen);
    };

    console.table(filter)


    return (
            <div className="px-10 mt-4 w-1/4 border-r">
                <YearFilter setFilter={setFilter} filter={filter}/>
                <UCFilter/>
            </div>
        )
}