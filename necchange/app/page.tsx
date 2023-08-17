"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from './components/calendar/CalendarSidebar';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [ucs, setUcs] = useState([]);

  useEffect(() => {
    axios.get("api/calendar/getCalendar").then((res) => setEvents(res.data.response));
  }, []);

  useEffect(() => {
    axios.get("api/calendar/getUCS").then((res) => setUcs(res.data.response));
  }, []);
  
  return (
    <Sidebar ucs={ucs}>
      <div className="p-14 overflow-y-scroll calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, googleCalendarPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth",
          }}
          initialView="dayGridMonth"
          displayEventTime={false}
          events={events}
          height="80vh"
        />
      </div>
    </Sidebar>
  );
}
