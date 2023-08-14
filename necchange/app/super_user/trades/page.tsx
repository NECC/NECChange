'use client'
import BasicDateTimePicker from "@/app/components/globals/BasicDateTimePicker"
import { useEffect, useState } from "react"

export default function manageTrades(){
    const [status, setStatus] = useState('Fechado')
    const [startDate, setStartDate] = useState(null);
    const [closeDate, setCloseDate] = useState(null);

    useEffect(() =>{
        console.log(startDate, closeDate);
    }, [startDate, closeDate])

    return(
            <div className="flex justify-center items-center bg-white text-black w-screen h-screen">
                <div className="grid grid-cols-2 gap-4 place-items-center">
                    <div className="col-span-2 text-xl">
                        Estado: {status}
                    </div>
                    <div className="col-span-2 text-xl font-bold">
                        Definir datas para trocas
                    </div>
                    <div>
                        <BasicDateTimePicker label={'Hora de começo'} value={startDate} setValue={setStartDate}/>
                    </div>
                    <div>
                        <BasicDateTimePicker label={'Hora de fecho'} value={closeDate} setValue={setCloseDate}/>
                    </div>
                    <div className="w-full col-span-2 text-white font-bold">
                        <button className="border w-full p-2 rounded-lg bg-blue-500 hover:bg-blue-600">Submit</button>
                    </div>
                    <div className="w-full col-span-2 text-white font-bold">
                        <button className="border w-full p-2 rounded-lg bg-red-500 hover:bg-red-600">Fechar período de trocas</button>
                    </div>
                </div>
            </div>
    )
}