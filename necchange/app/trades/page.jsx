'use client'

import StudentSchedule from '../components/trades/schedule/StudentSchedule'
import PopUp from '../components/trades/popUp/PopUp'
import { useState, useEffect } from 'react'

import axios from 'axios'

export default function Home() {
    const student_nr = 'A96516';
    const [isTradesOpened, setIsTradesOpened] = useState(false);
    const [classes, setClasses] = useState([]);
  
    const handleTradesPopUp = () => setIsTradesOpened(!isTradesOpened);
  
    useEffect(() => {
      const getEvents = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/trades/student_schedule/${student_nr}`);
          setClasses(response.data.response);
          console.log(classes)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      getEvents();
    }, []); // The empty array [] ensures the effect is only run once, on the initial render
    

    return (
      <div className='bg-white h-screen'>
        <div className='flex justify-center p-8'>
          Aqui vai ficar a Navbar
        </div>
        <div className='ml-auto mr-auto pl-32 pr-32'>
          <StudentSchedule events={classes} handleTradesPopUp={handleTradesPopUp} />
        </div>
        <PopUp handleTradesPopUp={handleTradesPopUp} isTradesOpened={isTradesOpened} />
      </div>
    );
}