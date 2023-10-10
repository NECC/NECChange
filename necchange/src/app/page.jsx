"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import ptLocale from "@fullcalendar/core/locales/pt";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [events, setEvents] = useState({
    testes: [],
    eventos: [],
  });
  const [filteredEvents, setFilteredEvents] = useState({
    testes: [],
    eventos: [],
  });
  const [actualFilter, setActualFilter] = useState({
    yearFilter: [],
    typeFilter: [],
  });
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

      const divideByType = ucsCurrentSeason.reduce((acc, uc) => {
        const year = getYearByEvent(uc);

        if (year != 0) { 

          acc.testes.push({...uc, year});
          return acc;

        } else {

          acc.eventos.push({...uc, year});
          return acc;

        }
      }, { eventos: [], testes: [] });
      
      setEvents(divideByType);
      setFilteredEvents(divideByType);
    });
  }, []);
  
  useEffect(() => {

    if (actualFilter.yearFilter.length != 0) {
        
      const newTests = events.testes.filter((elem) => {
        return actualFilter.yearFilter.includes(elem.year) || elem.year == 0;
      });
      
      setFilteredEvents({ testes: newTests, eventos: events.eventos });
        
    } else {
      setFilteredEvents(events);
    }

    // if (actualFilter.typeFilter.includes('testes')) {

    //   const newTests = events.testes.filter((elem) => {
    //     return actualFilter.yearFilter.includes(elem.year);
    //   });
      
    //   setFilteredEvents({ testes: newTests, eventos: events.eventos }); 
    // } else setFilteredEvents({ testes: [], eventos: filteredEvents.eventos });
    
    // if (actualFilter.typeFilter.includes('eventos')) {
    //   setFilteredEvents({ testes: filteredEvents.testes, eventos: events.eventos})
    // } else setFilteredEvents({ testes: filteredEvents.testes, eventos: [] });


    console.log(filteredEvents);
  }, [actualFilter.yearFilter, actualFilter.typeFilter]);

  // useEffect(() => {
  //   axios.get("/api/calendar/getUCS").then((res) => {
  //     setUCs(res.data.response);
  //     // console.log("UCS: " ,res.data.response);
  //   })
  // }, []);

  const handleYear = (e) => {
    const year = Number((e.target.id).charAt(0));

    if (actualFilter.yearFilter.includes(year)) {
      const newArray = actualFilter.yearFilter.filter((y) => y != year);
      setActualFilter({ yearFilter: newArray, typeFilter: actualFilter.typeFilter });
    } else {
      const newArray = [...actualFilter.yearFilter, year];
      setActualFilter({ yearFilter: newArray, typeFilter: actualFilter.typeFilter });
    }
  }

  const handleType = (e) => {
    const type = e.target.id;

    if (actualFilter.typeFilter.includes(type)) {
      const newArray = actualFilter.typeFilter.filter((t) => t != type);
      setActualFilter({ typeFilter: newArray, yearFilter: actualFilter.yearFilter });
    } else {
      const newArray = [...actualFilter.typeFilter, type];
      setActualFilter({ typeFilter: newArray, yearFilter: actualFilter.yearFilter });
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
    <div className="bg-white min-h-screen pt-24 flex">
      <div className="p-6">
        <div>
          <input onChange={handleType} type="checkbox" name="testes" id="testes" />
          <label className="text-xl pl-2" htmlFor="testes">Testes</label>
        </div>
        <div>
          <input onChange={handleType} type="checkbox" name="eventos" id="eventos" />
          <label className="text-xl pl-2" htmlFor="eventos">Eventos</label>
        </div>
        <div>
          <input onChange={handleYear} type="checkbox" name="1ano" id="1ano" />
          <label className="text-xl pl-2" htmlFor="1ano">1° ano</label>
        </div>
        <div>
          <input onChange={handleYear} type="checkbox" name="2ano" id="2ano" />
          <label className="text-xl pl-2" htmlFor="2ano">2° ano</label>
        </div>
        <div>
          <input onChange={handleYear} type="checkbox" name="3ano" id="3ano" />
          <label className="text-xl pl-2" htmlFor="3ano">3° ano</label>
        </div>
      </div>
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
          events={filteredEvents.testes}
          eventColor="blue-sky-500"
          height="80vh"
        />
      </div>
    </div>
  );
}
