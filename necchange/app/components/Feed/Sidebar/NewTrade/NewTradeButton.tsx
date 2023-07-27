import { useState } from "react";
import PopUp from "./popUp/PopUp";
import { ClassesI } from "@/app/horario/interface";

export default function NewTrade(){
    const student_nr = 'A94447';

    const [isTradesOpened, setIsTradesOpened] = useState(false);

    
    const handleTradesPopUp = () => setIsTradesOpened(!isTradesOpened);
    
    return(
        <div className="mt-64">
            <button className="flex justify-center w-full p-1 rounded-md bg-[#018ccb] hover:bg-[#007cb6] text-white font-semibold"
                    onClick={handleTradesPopUp}>
                Solicitar troca
            </button>
            <PopUp handleTradesPopUp={handleTradesPopUp} isTradesOpened={isTradesOpened} student_nr={student_nr}/>
        </div>
    )
}