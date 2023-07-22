import { UnidadesCurricularesI } from "@/app/feed/interface";
import { useState, Dispatch, SetStateAction } from "react";
import { FiChevronDown } from "react-icons/fi";

interface UcsFilterProps {
    setUcsFilter: Dispatch<SetStateAction<UnidadesCurricularesI>>,
    ucsFilter: UnidadesCurricularesI,
    ucsArray: string[],
}


export default function UCFilter(props: UcsFilterProps) {
    const {
        ucsArray,
        ucsFilter,
        setUcsFilter
    } = props;

    const [isVisible, setIsVisible] = useState(false);
    const toggleIsVisible = () => setIsVisible(!isVisible);

    // function to change the filter state
    const handleFilter = (e: any) => {
        const newFilter = {
            ...ucsFilter,
            [e.target.id]: e.target.checked,
        }
        setUcsFilter(newFilter);
    }
    

    // This little code snippet will transform a portuguese phrase in a concatenated with each word capitalized string
    // without accents and ç
    // Álgebra Universal e Categorias = AlgebraUniversalECategorias
    const arraySanitization = (array: string[]): string[] => (
        array.map((item: string) => ((item
                        .split(" ")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" "))
                        .replace(/[,\s]/g, ""))
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
        )
    )

    return (
        <div className="border-b pb-3"> 
            <div className="flex items-center justify-between" onClick={toggleIsVisible}>
                <strong className="text-lg cursor-pointer">Unidade Curricular</strong>
                <span className="ml-2 cursor-pointer">
                    <FiChevronDown size={24} className={`transition-all duration-300 ${isVisible ? "rotate-180" : "rotate-0"}`}/>
                </span>

            </div>
            {isVisible && (
                <form className="mt-2 accent-blue-500 ">
                    {
                        ucsArray.map((uc, index) => (
                            <div key={index}>
                                <input onClick={handleFilter} type="checkbox" id={`${arraySanitization(ucsArray)[index]}`} name="uc" value={`${arraySanitization(ucsArray)[index]}`} className="mb-2"/>
                                <label htmlFor={`${arraySanitization(ucsArray)[index]}`} className="mr-2 "> {uc} </label>
                            </div>
                        ))
                    }

                </form>
            )}
        </div>
    );
}