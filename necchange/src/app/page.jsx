"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import ptLocale from "@fullcalendar/core/locales/pt";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("/api/calendar/getCalendar").then((res) => {
      setEvents(res.data.response);
      console.log(res.data.response);
    });
  }, []);

  useEffect(() => {
    axios.get("/api/calendar/getUCS").then((res) => setUcs(res.data.response));
  }, []);

  return (
    <div className="bg-white min-h-screen pt-24">
      <div className="py-14 px-8 overflow-y-scroll full-calendar calendar-container container mx-auto">
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
          events={events}
          eventColor="blue-sky-500"
          height="80vh"
        />
      </div>
    </div>
  );
}
