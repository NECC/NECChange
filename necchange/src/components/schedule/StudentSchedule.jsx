"use client";

import React, { useRef, useState } from "react";
import useWindowSize from "@rooks/use-window-size";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptLocale from "@fullcalendar/core/locales/pt";

export default function StudentSchedule(props) {
  const { events, onEventClick } = props;
  const { innerWidth } = useWindowSize();
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);
  // breakpoints
  const isPhone = innerWidth && innerWidth < 640;
  const isTablet = innerWidth && innerWidth < 768;
  // valid date range
  const now = new Date();
  const startDate = new Date().setDate(now.getDate() - now.getDay() + 1);
  const endDate = new Date().setDate(now.getDate() + (5 - now.getDay()));

  const updateDate = (dateModifier) => {
    const date = new Date(
      currentDate.setDate(currentDate.getDate() + dateModifier)
    );
    setCurrentDate(date);
  };

  const handlePrevClick = () => {
    updateDate(-1);
    if (calendarRef.current) {
      calendarRef.current.getApi().prev(); // Chama o método prev() do FullCalendar
    }
  };

  const handleNextClick = () => {
    updateDate(1);
    if (calendarRef.current) {
      calendarRef.current.getApi().next(); // Chama o método next() do FullCalendar
    }
  };

  return (
    <div className="full-calendar schedule-container min-h-min">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        allDaySlot={false}
        slotEventOverlap={false}
        weekends={false}
        locale={ptLocale}
        firstDay={0}
        initialView={"timeGridWeek"}
        titleFormat={(info) => `Horário ${info.date.year}`}
        headerToolbar={{
          left: "title",
          center: isPhone ? "timeGridWeek,timeGridDay" : "",
          right: isPhone ? "prev,today,next" : "",
        }}
        dayHeaderFormat={{
          weekday: isTablet ? "short" : "long",
        }}
        nowIndicator={true}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        validRange={{
          start: new Date(startDate),
          end: new Date(endDate),
        }}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        events={events}
        height={"auto"}
        customButtons={{
          prev: {
            click: handlePrevClick,
          },
          next: {
            click: handleNextClick,
          },
        }}
        eventClick={onEventClick}
      />
    </div>
  );
}
