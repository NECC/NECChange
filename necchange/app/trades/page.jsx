import StudentSchedule from '../components/trades/schedule/StudentSchedule'

export default function Home() {
    return (
        <div className='bg-white h-screen'>
            <div className='flex justify-center p-8'>
                Aqui vai ficar a Navbar
            </div>
            <div className='ml-auto mr-auto pl-32 pr-32'>
                <StudentSchedule student_nr={'A94447'}/>
            </div>
        </div>
    )
}