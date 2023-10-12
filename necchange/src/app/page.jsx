"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import ptLocale from "@fullcalendar/core/locales/pt";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [events, setEvents] = useState({
    avaliacoes: [],
    eventos: [],
  });
  const [filteredEvents, setFilteredEvents] = useState({
    avaliacoes: [],
    eventos: [],
  });
  const [finalArray, setFinalArray] = useState([]);
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
        const { year, type } = getYearAndTypeByEvent(uc);

        if (year != 0) { 

          acc.avaliacoes.push({ ...uc, year, type });
          return acc;

        } else {

          acc.eventos.push({ ...uc, year, type });
          return acc;

        }
      }, { eventos: [], avaliacoes: [] });
      
      setEvents(divideByType);
      setFilteredEvents(divideByType);
      setFinalArray([...divideByType.eventos, ...divideByType.avaliacoes]);
    });
  }, []);
  
  // This useEffect is the most important, it has all the logic to filter the events in calendar
  useEffect(() => {

    if (actualFilter.typeFilter.length == 0) {
      setFilteredEvents({ eventos: events.eventos, avaliacoes: events.avaliacoes });
      setFinalArray([...events.eventos, ...events.avaliacoes]);
    } else {
      if (actualFilter.typeFilter.includes('avaliacoes') && actualFilter.typeFilter.includes('eventos')) {
        setFilteredEvents({ eventos: events.eventos, avaliacoes: events.avaliacoes });
        setFinalArray([...events.eventos, ...events.avaliacoes]);        
      } else if (actualFilter.typeFilter.includes('avaliacoes')) {
        setFilteredEvents({ eventos: [], avaliacoes: events.avaliacoes });
        setFinalArray([...events.avaliacoes]);
      } else {
        setFilteredEvents({ eventos: events.eventos, avaliacoes: [] });
        setFinalArray([...events.eventos]);
      }
    }

    if (actualFilter.yearFilter.length != 0) {    
      const newTests = events.avaliacoes.filter((elem) => {
        return actualFilter.yearFilter.includes(elem.year) || elem.year == 0;
      });
      
      setFilteredEvents({ avaliacoes: newTests });
      
      if (actualFilter.typeFilter.includes('eventos')) setFinalArray([...newTests, ...events.eventos]);
      else setFinalArray(newTests);
    }
    
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

  const getYearAndTypeByEvent = (event) => {
    const yearRegexp = event.title.match(/\((1|2|3)º ano\)/)
    const matches = event.title.match(/\b(Teste|Exame|Entrega)\b/);
    const result = {
      type: null,
      year: null,
    };
  
    if (matches) {
      matches.forEach(match => {
          if (match === "Teste" || match === "Exame" || match === "Entrega") {
              result.type = match;
          } 
          
          if (yearRegexp) {
              result.year = Number(yearRegexp[1]);
          }
      });
    }

    if (!result.type && !result.year) {
      result.type = 'Evento';
      result.year = 0;
    }

    return result;
  }

  return (
    <div className="bg-white min-h-screen pt-24 flex">
      <div className="p-6">
        <div>
          <input onChange={handleType} type="checkbox" name="avaliacoes" id="avaliacoes" />
          <label className="text-xl pl-2" htmlFor="avaliacoes">Avaliações</label>
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
          events={finalArray}
          eventColor="blue-sky-500"
          height="80vh"
        />
      </div>
    </div>
  );
}
