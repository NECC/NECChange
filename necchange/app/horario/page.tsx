'use client'
import StudentSchedule from '../components/trades/schedule/StudentSchedule'
import PopUp from '../components/trades/popUp/PopUp'

import { useSession } from "next-auth/react";
import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation';

import axios from 'axios'


function encrypt(number: any) {
  console.log(number);

  const split_string = number.split("")

  const start = [split_string[0], split_string[1]]
  const decodedNr = split_string.slice(2).reverse()

  const number_decoded = start.concat(decodedNr)

  console.log(number_decoded.join('').toUpperCase());
  return number_decoded.join('').toUpperCase()
}

export default function Home() {
  let student_nr = '';
  const [isTradesOpened, setIsTradesOpened] = useState(false);
  const [classes, setClasses] = useState([]);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/')
    },
  });

  const handleTradesPopUp = () => setIsTradesOpened(!isTradesOpened);

  useEffect(() => {
    if (session) {
      student_nr = encrypt(session.user?.email?.split("@")[0])
      const getEvents = async () => {
        try {
          const response = await axios.get(`api/trades/student_schedule/${student_nr}`);
          setClasses(response.data.response);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      getEvents();
    }
  }, [session]);


  return (
    <div className='bg-white h-screen pt-24 '>
      <div className='ml-auto mr-auto px-8 md:px-16'>
        <StudentSchedule events={classes} handleTradesPopUp={handleTradesPopUp} />
      </div>
      <PopUp handleTradesPopUp={handleTradesPopUp} isTradesOpened={isTradesOpened} classes={classes} student_nr={student_nr} />
    </div>
  );
}