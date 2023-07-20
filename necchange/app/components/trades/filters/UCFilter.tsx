import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function UCFilter() {
    const [isVisible, setIsVisible] = useState(false);
    const toggleIsVisible = () => setIsVisible(!isVisible);


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
                    <form>
                        <div>
                            <input type="checkbox" id=" Álgebra Linear CC " name="uc" value="Álgebra Linear CC" className="mb-2" />
                            <label htmlFor=" Álgebra Linear CC " className="mr-2 "> Álgebra Linear CC </label>
                        </div>

                        <div>
                            <input type="checkbox" id="Cálculo" name="uc" value="Cálculo" className="mb-2" />
                            <label htmlFor="Cálculo" className="mr-2">Cálculo</label>
                        </div>

                        <div>
                            <input type="checkbox" id="Programação Funcional" name="uc" value="Programação Funcional" className="mb-2" />
                            <label htmlFor="Programação Funcional" className="mr-2">Programação Funcional</label>
                        </div>
                    </form>
                </form>
            )}
        </div>
    );
}