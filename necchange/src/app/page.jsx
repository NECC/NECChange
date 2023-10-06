"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import ptLocale from "@fullcalendar/core/locales/pt";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [yearFilter, setYearFilter] = useState([]);
  const [currentSeason, setCurrentSeason] = useState('2023/2024');
  // const [UCs, setUCs] = useState([]);

  useEffect(() => {
    axios.get("/api/calendar/getCalendar").then((res) => {
      
      // Function that filters 2023/2024 events (Should be deleted later, it's just to clean old events in the development)
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
      setFilteredEvents(eventsFinished);
      console.log(eventsFinished);
    });
  }, []);
  
  useEffect(() => {
    if (yearFilter.length != 0) {
      const newEvents = events.filter((elem) => {
        return yearFilter.includes(elem.year) || elem.year == 0;
      })
      setFilteredEvents(newEvents);
    } else {
      setFilteredEvents(events);
    }
  }, [yearFilter]);

  // useEffect(() => {
  //   axios.get("/api/calendar/getUCS").then((res) => {
  //     setUCs(res.data.response);
  //     // console.log("UCS: " ,res.data.response);
  //   })
  // }, []);

  const handleYear = (e) => {
    const year = Number((e.target.id).charAt(0));

    if (yearFilter.includes(year)) {
      const newArray = yearFilter.filter((y) => y != year);
      setYearFilter(newArray);
    } else {
      const newArray = [...yearFilter, year];
      setYearFilter(newArray);
    }
  }

  const getYearByEvent = (event) => {
    const regex = /\((1|2|3)º ano\)/
    const match = event.title.match(regex);

    if (match) {
      const year = parseInt(match[1]);
      return year;
    } else return 0;
  }

  return (
    <div className="bg-white min-h-screen pt-24">
      <input onChange={handleYear} type="checkbox" name="1ano" id="1ano" />
      <label htmlFor="1ano">1° ano</label>
      <input onChange={handleYear} type="checkbox" name="2ano" id="2ano" />
      <label htmlFor="2ano">2° ano</label>
      <input onChange={handleYear} type="checkbox" name="3ano" id="3ano" />
      <label htmlFor="3ano">3° ano</label>
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
          events={filteredEvents}
          eventColor="blue-sky-500"
          height="80vh"
        />
      </div>
    </div>
  );
}
