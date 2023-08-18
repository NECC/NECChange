import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface UcsFilterProps {
    setUcsFilter: Function,
    ucsFilter: string[],
    ucsArray: string[],
}

export default function UCFilter(props: UcsFilterProps) {
    const {
        ucsArray,
        ucsFilter,
        setUcsFilter,
    } = props;

    const [isVisible, setIsVisible] = useState(false);
    const toggleIsVisible = () => setIsVisible(!isVisible);

    // function to change the filter state
    const handleFilter = (e: any) => {    
        console.log("id", e.target.id);
        if(ucsFilter.indexOf(e.target.id) == -1){
            const newFilter: string[] = [
                ...ucsFilter,
                e.target.id,
            ]
            setUcsFilter(newFilter);
        }
        else{
            const newFilter = ucsFilter.filter((uc: any) => {                
                return uc != e.target.id
            })
            setUcsFilter(newFilter);
        }
    }

    return (
        <div className="border-b border-t pb-3 pt-3"> 
            <div className="flex items-center justify-between" onClick={toggleIsVisible}>
                <strong className="text-base ml-7 cursor-pointer">Unidade Curricular</strong>
                <span className="ml-2 cursor-pointer">
                    <FiChevronDown size={24} className={`transition-all duration-300 ${isVisible ? "rotate-180" : "rotate-0"}`}/>
                </span>

            </div>
            {isVisible && (
                <form className="mt-2 accent-blue-500 text-base">
                    {
                        ucsArray.map((uc, index) => (
                            <div className="ml-7" key={index}>
                                <input onChange={handleFilter} type="checkbox" id={`${ucsArray[index]}`} name="uc" value={`${ucsArray[index]}`} className="mb-2"/>
                                <label htmlFor={`${ucsArray[index]}`} className="mr-2 "> {uc} </label>
                            </div>
                        ))
                    }

                </form>
            )}
        </div>
    );
}