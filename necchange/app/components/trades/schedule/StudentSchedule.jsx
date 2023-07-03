'use client'

import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default function StudentSchedule({student_nr}) {
    const minDate = new Date();
    minDate.setHours(8,0,0);

    const maxDate = new Date();
    maxDate.setHours(20,0,0);

    return (
        <FullCalendar
            plugins={[ dayGridPlugin , timeGridPlugin, interactionPlugin]}
            initialView={"timeGridWeek"}
            weekends={false}
            headerToolbar={{
                start: "today prev,next",
                center: "title",
                end: "dayGridMonth, timeGridWeek, timeGridDay",
            }}
            slotMinTime="08:00:00" // Set the minimum time to 8am
            slotMaxTime="20:00:00" // Set the maximum time to 8pm      
            events={[
                { 
                    title: 'Lançamento NECChange', 
                    start: '2023-07-03T09:00',
                    end: '2023-07-03T11:00'
                },
                { 
                    title: 'Começo das Aulas', 
                    start: '2023-07-05T15:00',
                    end: '2023-07-05T17:00'
                }
            ]}
            height={'80vh'}
            
        />
    )
}