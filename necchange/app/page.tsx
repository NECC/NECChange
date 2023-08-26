"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import ptLocale from "@fullcalendar/core/locales/pt";
import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "./components/calendar/CalendarSidebar";

import colors, { red } from "tailwindcss/colors";
// import './calendar.css';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [ucs, setUcs] = useState([]);

  useEffect(() => {
    axios
      .get("api/calendar/getCalendar")
      .then((res) => setEvents(res.data.response));
  }, []);

  useEffect(() => {
    axios.get("api/calendar/getUCS").then((res) => setUcs(res.data.response));
  }, []);

  const styles = `
  .calendar-container {
    --fc-border-color: ${colors.gray[200]};
  
    --fc-button-text-color: ${colors.gray[900]};
    --fc-button-bg-color: ${colors.gray[50]};
    --fc-button-border-color: ${colors.gray[100]};
    --fc-button-hover-bg-color: ${colors.gray[100]};
    --fc-button-hover-border-color: ${colors.gray[200]};
    --fc-button-active-bg-color: ${colors.blue[500]};
    --fc-button-active-border-color: ${colors.blue[500]};
  
    --fc-event-bg-color: ${colors.blue[500]};
    --fc-event-border-color: ${colors.blue[500]};
    --fc-event-text-color: ${colors.white};

    --fc-today-bg-color: ${colors.blue[100]};
  }

  .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active {
    color: ${colors.white};
  }

  .fc-view-harness {
    border-radius: 8px;
    overflow: hidden;
  }

  .fc .fc-daygrid-day-top {
    flex-direction: row;
  }

  .fc .fc-day-other .fc-daygrid-day-top {
    opacity: 1;
    color: ${colors.gray[600]};
  }

  td.fc-day-other {
    background-color: ${colors.gray[100]};
  }

  td.fc-day-today {
    color: ${colors.blue[700]};
  }

  .fc-col-header-cell-cushion {
    text-transform: capitalize;
  }

  table {
    border-radius: 8px;
    overflow: hidden;
    background-color: ${colors.white};
  }
  `;

  return (
    <Sidebar ucs={ucs}>
      <style>{styles}</style>
      <div className="py-14 px-8 overflow-y-scroll calendar-container container mx-auto">
        <FullCalendar
          plugins={[dayGridPlugin, googleCalendarPlugin]}
          locale={ptLocale}
          customButtons={{
            myCustomButton: {
              text: "custom",
              click: () => {
                alert("clicked the custom button!");
              },
            },
          }}
          headerToolbar={{
            left: "prev,today,next",
            center: "title",
            right: "dayGridWeek,dayGridMonth",
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
