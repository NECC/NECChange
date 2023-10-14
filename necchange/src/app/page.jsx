"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import ptLocale from "@fullcalendar/core/locales/pt";
import { useState } from "react";
import FilterCalendar from "@/components/calendar/FilterCalendar";


export default function CalendarPage() {
  const [finalArray, setFinalArray] = useState([]);

  return (
    <div className="bg-white min-h-screen pt-24 flex">
      
      <FilterCalendar setFinalArray={setFinalArray} finalArray={finalArray}/>

      <div className="pt-8 px-8 overflow-y-scroll full-calendar calendar-container container mx-auto">
        <FullCalendar
          plugins={[dayGridPlugin, googleCalendarPlugin]}
          locale={ptLocale}
          firstDay={0}
          headerToolbar={{
            left: "prev,today,next",
            center: "title",
            right: "dayGridWeek,dayGridMonth",
          }}
          initialView="dayGridMonth"
          displayEventTime={false}
          events={finalArray}
          eventColor="blue-sky-500"
          height="80vh"
        />
      </div>
    </div>
  );
}
