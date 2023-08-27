"use client";

import React, { useRef, useState } from "react";
import useWindowSize from "@rooks/use-window-size";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptLocale from "@fullcalendar/core/locales/pt";
import { CalendarProps } from "./interface";

export default function StudentSchedule(props: CalendarProps) {
  const { events } = props;
  const { innerWidth } = useWindowSize();
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef<FullCalendar | null>(null);

  const updateDate = (dateModifier: number) => {
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

  const isPhone = innerWidth && innerWidth < 640;
  const isTablet = innerWidth && innerWidth < 768;

  const startingDate = new Date().setDate(
    currentDate.getDate() - currentDate.getDay()
  );
  const endingDate = new Date().setDate(
    currentDate.getDate() + (6 - currentDate.getDay())
  );

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
        initialView={isPhone ? "timeGridDay" : "timeGridWeek"}
        titleFormat={(info) => `Horário ${info.date.year}`}
        headerToolbar={{
          start: isPhone ? "prev" : "",
          center: "title",
          end: isPhone ? "next" : "",
        }}
        dayHeaderFormat={{
          weekday: isTablet ? "short" : "long",
        }}
        nowIndicator={true}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        validRange={{
          start: new Date(startingDate),
          end: new Date(endingDate),
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
      />
    </div>
  );
}
