'use client'

import React from 'react'
import useWindowSize from '@rooks/use-window-size'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import './calendar.styles.css';

export default function StudentSchedule({student_nr, handleTradesPopUp}) {
    const {innerWidth, innerHeight} = useWindowSize(); // Get width and height size

    const minDate = new Date();
    minDate.setHours(8,0,0);

    const maxDate = new Date();
    maxDate.setHours(20,0,0);


    return (
        <FullCalendar
            plugins={[ dayGridPlugin , timeGridPlugin, interactionPlugin]}

            customButtons={{
                openTrades: {
                    text: "Trocas de turnos",
                    click: () => {
                        handleTradesPopUp()
                    },
                }
            }}

            allDaySlot={false}

            initialView={innerWidth < 640 ? "timeGridDay" : "timeGridWeek"}
            weekends={false}
            

            headerToolbar={{
                start: innerWidth < 640 ? "prev next" : "",
                end: "openTrades",
            }}
            //footerToolbar={{
            //    center: "prev next"
            //}}
            // start: "today dayGridMonth,timeGridWeek,timeGridDay",
            
            dayHeaderFormat={{
                weekday: innerWidth < 1100 ? 'short' : 'long', 
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

            height={'80vh'}

            events={[
                { 
                    title: 'Lançamento NECChange', 
                    start: '2023-07-03T09:00',
                    end: '2023-07-03T11:00',
                    //display: 'background',
                },
                { 
                    title: 'Análise - [TP1]', 
                    start: '2023-07-03T12:00',
                    end: '2023-07-03T14:00',
                    //display: 'background',
                },
                { 
                    title: 'Sistemas de Computação - [PL3]', 
                    start: '2023-07-06T09:00',
                    end: '2023-07-06T11:00',
                    //display: 'background',
                },
                { 
                    title: 'Laboratórios de Algoritmia 1 - [PL4]', 
                    start: '2023-07-04T10:00',
                    end: '2023-07-04T12:00',
                    //display: 'background',
                },
                { 
                    title: 'Matemática Discreta - [TP2]', 
                    start: '2023-07-07T10:00',
                    end: '2023-07-07T12:00',
                    //display: 'background',
                },
                { 
                    title: 'Geometria - [TP2]', 
                    start: '2023-07-05T09:00',
                    end: '2023-07-05T12:00',
                    //display: 'background',
                },
                { 
                    title: 'Programação Imperativa - [T1]', 
                    start: '2023-07-05T12:00',
                    end: '2023-07-05T14:00',
                    //display: 'background',
                },
                { 
                    title: 'Começo das Aulas', 
                    start: '2023-07-05T15:00',
                    end: '2023-07-05T17:00'
                }
            ]}
            
            
        />
    )
}