'use client'

import StudentSchedule from '../components/schedule/StudentSchedule'

import { useSession } from "next-auth/react";
import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation';

import axios from 'axios'

export default function Home() {
  const [classes, setClasses] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      const getEvents = async () => {
        try {
          const response = await axios.get(`api/trades/student_schedule/${session.user?.number}`);
          setClasses(response.data.response);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      getEvents();
    }
  }, [session]) 
    
    return (
      <div className='bg-white h-screen pt-24 '>
        <div className='ml-auto mr-auto px-8 md:px-16'>
          <StudentSchedule events={classes} />
        </div>
      </div>
  );
}