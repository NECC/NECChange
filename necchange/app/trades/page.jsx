'use client'

import StudentSchedule from '../components/trades/schedule/StudentSchedule'
import PopUp from '../components/trades/popUp/PopUp'
import Image from 'next/image'
import { useState } from 'react'

import axios from 'axios'

export default async function Home() {
    const student_nr = 'A92898'

    const getEvents = async () => {
        // depois alterar este path
        let classes = await axios.get(`http://localhost:3000/api/trades/student_schedule/${student_nr}`);

        return classes.data.response;
    } 

    const classes = await getEvents()    

    return (
        <div className='bg-white h-screen'>
            <div className='flex justify-center p-8'>
                Aqui vai ficar a Navbar
            </div>
            <div className='ml-auto mr-auto pl-32 pr-32'>
                <StudentSchedule events={classes}/>
            </div>
            <PopUp handleTradesPopUp={handleTradesPopUp} isTradesOpened={isTradesOpened}/>
        </div>
    ) 
}