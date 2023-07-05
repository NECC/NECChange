'use client'

import StudentSchedule from '../components/trades/schedule/StudentSchedule'
import PopUp from '../components/trades/popUp/PopUp'
import Image from 'next/image'
import { useState } from 'react'

export default function Home() {
    const [isTradesOpened, setIsTradesOpened] = useState(false);

    const handleTradesPopUp = () => setIsTradesOpened(!isTradesOpened);

    return (
        <div className='bg-blue-100 h-screen pt-8 overflow-hidden'>
            <div className='mx-auto w-full pl-4 pr-4 relative lg:pl-32 lg:pr-32 md:pr-16 md:pl-16 sm:pl-8 sm:pr-8'>
                <StudentSchedule handleTradesPopUp={handleTradesPopUp} student_nr={'A94447'}/>
            </div>
            <PopUp handleTradesPopUp={handleTradesPopUp} isTradesOpened={isTradesOpened}/>
        </div>
    )
}