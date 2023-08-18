"use client";

import React, { useRef, useState } from 'react';
import useWindowSize from '@rooks/use-window-size';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './calendar.styles.css';
import { CalendarProps } from './interface';

export default function StudentSchedule(props: CalendarProps) {
    const { events } = props;
    const { innerWidth } = useWindowSize();
    const [currentDate, setCurrentDate] = useState(new Date());
    const calendarRef = useRef<FullCalendar | null>(null);

    const updateDate = (dateModifier: number) => {
        const date = new Date(currentDate.setDate(currentDate.getDate() + dateModifier));
        setCurrentDate(date);
    }

    const handlePrevClick = () => {
        updateDate(-1);
        if (calendarRef.current) {
            calendarRef.current.getApi().prev(); // Chamar o método prev() do FullCalendar
        }
    };
    
    const handleNextClick = () => {
        updateDate(1);
        if (calendarRef.current) {
            calendarRef.current.getApi().next(); // Chamar o método next() do FullCalendar
        }
    };


    const minDate = new Date();
    minDate.setHours(8, 0, 0);

    const maxDate = new Date();
    maxDate.setHours(20, 0, 0);

    return (
        <FullCalendar
            ref={calendarRef} 
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            allDaySlot={false}
            initialView={innerWidth && innerWidth < 640 ? 'timeGridDay' : 'timeGridWeek'}
            weekends={false}
            headerToolbar={{
                start:
                    innerWidth && innerWidth < 640 && currentDate.getDay() > 1 ? 'prev' : '',
                center: '',
                end: innerWidth && innerWidth < 640 && currentDate.getDay()  < 5 ? 'next' : '',
            }}
            
            dayHeaderFormat={{
                weekday: innerWidth && innerWidth < 1100 ? 'short' : 'long',
            }}
            titleRangeSeparator='/'
            buttonText={{
                today: 'Today',
                month: 'Month',
                day: 'Day',
                week: 'Week',
            }}
            nowIndicator={true}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }}
            events={events}
            height={'85vh'}
            customButtons={{
                prev: {
                    click: handlePrevClick,
                },
                next: {
                    click: handleNextClick,
                },
            }}
        />
    );
}
