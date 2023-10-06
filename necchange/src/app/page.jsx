"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import ptLocale from "@fullcalendar/core/locales/pt";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [currentSeason, setCurrentSeason] = useState('2023/2024');

  useEffect(() => {
    axios.get("/api/calendar/getCalendar").then((res) => {
      
      // Function that filters 2023/2024 events
      const ucsCurrentSeason = res.data.response.reduce((acc, uc) => {

        const season = currentSeason.split('/').map((year) => Number(year));
        const ucArrayData = uc.start.split("-");
        
        if (season.includes(Number(ucArrayData[0]))) {
          acc.push(uc);
        } 
        return acc;
      }, []);
      
      const eventsFinished = ucsCurrentSeason.map((uc) => {
        const year = getYearByEvent(uc);
        return {
          ...uc,
          year
        }
      });
      
      setEvents(eventsFinished);
      console.log(eventsFinished);
    });
  }, []);

  const getYearByEvent = (event) => {
    const regex = /\((1|2|3)º ano\)/
    const match = event.title.match(regex);

    if (match) {
      const year = parseInt(match[1]);
      return year;
    } else return 0;
  }
  
  // useEffect(() => {
  //   axios.get("/api/calendar/getUCS").then((res) => {
  //     setUCs(res.data.response);
  //     console.log("UCS: " ,res.data.response);
  //   })
  // }, []);

  return (
    <div className="bg-white min-h-screen pt-24">
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
          events={events}
          eventColor="blue-sky-500"
          height="80vh"
        />
      </div>
    </div>
  );
}
