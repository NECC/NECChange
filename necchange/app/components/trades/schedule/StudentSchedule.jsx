'use client'

import React from 'react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default function StudentSchedule({events}) {
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
            events={events}
            height={'80vh'}
        />
    )
}