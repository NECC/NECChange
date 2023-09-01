'use client'
import BasicDateTimePicker from "@/app/components/globals/BasicDateTimePicker"
import { useEffect, useState } from "react"
import axios from 'axios'
import Loader from "@/app/components/globals/Loader"
import moment from "moment";
import "moment/locale/pt";

import { ToastContainer , toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function convertToRegularDate(date: any){
    const day = date.date();
    const month = date.month();
    const hour = date.hour();
    const minutes = date.minutes();

    return day + "/" + month + " às " + hour + ":" + minutes;
}

export default function manageTrades(){
    const [status, setStatus] = useState('Fechado')
    const [loader, setLoader] = useState(false)
    const [startDate, setStartDate] = useState(null);
    const [closeDate, setCloseDate] = useState(null);

    const buttonStyle = "w-full col-span-2 text-white font-bold"

    useEffect(() =>{
        const get_status = async () => {
            await axios
                .get('/api/admin/trades_status')
                .then(res => {
                    
                    if(res.data.status.isOpen) {
                        const openDate = convertToRegularDate(moment(res.data.status.openDate))
                        const closeDate = convertToRegularDate(moment(res.data.status.closeDate))
                        setStatus(`Aberto de ${openDate} até ${closeDate}`)
                    } else {
                        setStatus('Fechado')
                    }
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                })
        }
        get_status()
    }, [loader]) 

    const handleTrades = async (action: any) => {
        setLoader(true)
        await axios
            .put('/api/admin/handle_trades_date', {close: action, openDate: startDate?.["$d"], closeDate: closeDate?.["$d"]})
            .then(res => {
                toast.success('Sucesso!')
                console.log(res);
            })
            .catch(err => {
                toast.error('Erro!')
                console.log(err);
            })
        setLoader(false)
    } 

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
                    <div className={buttonStyle}>
                        <button className="border w-full p-2 rounded-lg bg-blue-500 hover:bg-blue-600" onClick={() => {handleTrades(false)}}>Submeter</button>
                    </div>
                    <div className={buttonStyle}>
                        <button className="border w-full p-2 rounded-lg bg-red-500 hover:bg-red-600" onClick={() => {handleTrades(true)}}>Fechar período de trocas</button>
                    </div>
                </div>
                {loader && <Loader />}
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
    )
}