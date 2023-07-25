"use client";


import React from 'react'
import useWindowSize from '@rooks/use-window-size'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import './calendar.styles.css';
import { CalendarProps } from './interface';



export default function StudentSchedule(props: CalendarProps) {
    const {events, handleTradesPopUp} = props
    const {innerWidth, innerHeight} = useWindowSize(); // Get width and height size

    const minDate = new Date();
    minDate.setHours(8,0,0);

    const maxDate = new Date();
    maxDate.setHours(20, 0, 0);

    //console.table(events)

    return (
        <FullCalendar
            plugins={[ dayGridPlugin , timeGridPlugin, interactionPlugin]}

            customButtons={{
                openTrades: {
                    text: "Trocas de turnos",
                    click: () => handleTradesPopUp(),
                }
            }}

            allDaySlot={false}
            initialView={innerWidth && innerWidth < 640 ? "timeGridDay" : "timeGridWeek"}
            weekends={false}
            headerToolbar={{
                start: innerWidth && innerWidth < 640 ? "prev next" : "",
                end: "openTrades",
            }}
            //footerToolbar={{
            //    center: "prev next"
            //}}
            // start: "today dayGridMonth,timeGridWeek,timeGridDay",
            
            dayHeaderFormat={{
                weekday: innerWidth && innerWidth < 1100 ? 'short' : 'long', 
            }}

            titleRangeSeparator='/' // Jul 1/9

            buttonText={{ // Capitalize button text
                today: "Today",
                month: "Month",
                day: "Day",
                week: "Week",
            }}

            nowIndicator={true} // Implement the red row indicating the hour

            slotMinTime="08:00:00" // Set the minimum time to 8am
            slotMaxTime="20:00:00" // Set the maximum time to 8pm   

            slotLabelFormat={{ // Hour Format
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,

            }}   

            events={events}
            height={'85vh'}
        />
    )
}
