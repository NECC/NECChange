'use client'

import StudentSchedule from '../components/trades/schedule/StudentSchedule'
import PopUp from '../components/trades/popUp/PopUp'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { ClassesI } from './interface'


export default function Home() {
    const student_nr = 'A94447';
    const [isTradesOpened, setIsTradesOpened] = useState(false);
    const [classes, setClasses] = useState<Array<ClassesI>>([]);
  
    const handleTradesPopUp = () => setIsTradesOpened(!isTradesOpened);
  
    useEffect(() => {
      const getEvents = async () => {
        try {
          const response = await axios.get(`api/trades/student_schedule/${student_nr}`);
          setClasses(response.data.response);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      getEvents();
    }, []); 
    

    return (
      <div className='bg-white h-screen pt-24 '>
        <div className='ml-auto mr-auto px-8 md:px-16'>
          <StudentSchedule events={classes} handleTradesPopUp={handleTradesPopUp} />
        </div>
        <PopUp handleTradesPopUp={handleTradesPopUp} isTradesOpened={isTradesOpened} classes={classes} student_nr={student_nr}/>
      </div>
    );
}