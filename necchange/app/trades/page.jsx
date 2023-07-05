import StudentSchedule from '../components/trades/schedule/StudentSchedule'
import Image from 'next/image'

export default function Home() {
    return (
        <div className='bg-blue-100 h-screen pt-8 overflow-hidden'>
            <div className='mx-auto container px-8'>
                <StudentSchedule student_nr={'A94447'}/>
            </div>
        </div>
    )
}