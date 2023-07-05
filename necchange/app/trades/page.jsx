import StudentSchedule from '../components/trades/schedule/StudentSchedule'
import Image from 'next/image'

export default function Home() {
    return (
        <div className='bg-blue-100 h-screen pt-[110px] overflow-hidden'>
            <div className='ml-auto mr-auto pl-32 pr-32'>
                <StudentSchedule student_nr={'A94447'}/>
            </div>
        </div>
    )
}