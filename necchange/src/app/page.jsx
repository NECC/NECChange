"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import ptLocale from "@fullcalendar/core/locales/pt";
import { useState, useEffect } from "react";
import FilterCalendar from "@/components/calendar/FilterCalendar";
import axios from "axios";

export default function CalendarPage() {
  const [finalArray, setFinalArray] = useState([]);
  const [rawEvents, setRawEvents] = useState([]);
  const [mobileSideMenuIsOpen, setMobileSideMenuIsOpen] = useState(false);
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/calendar/getCalendar").then((res) => {
      setRawEvents(res.data.response)
      setFinalArray(res.data.response);
      setIsCalendarLoading(false);
    });
  }, []);

  return (
    <div className="bg-white min-h-screen pt-24 flex w-full">
      
      <FilterCalendar setFinalArray={setFinalArray} rawEvents={rawEvents}/>


      <div className="pt-8 px-8 overflow-y-scroll full-calendar calendar-container container mx-auto">
        {isCalendarLoading ?  (
          <div className="flex justify-center items-center h-full bg-white">
            <div className="border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"> </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
