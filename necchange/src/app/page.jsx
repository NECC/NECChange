"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import ptLocale from "@fullcalendar/core/locales/pt";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import MobileFilter from "@/components/calendar/MobileFilter";
import UCsObj from "../data/filters.json";
import CheckboxTree from "@/components/calendar/CheckboxTree/CheckboxTree";
import PopUpOnClick from "@/components/calendar/PopUpOnClick";
import { ScrollShadow } from "@nextui-org/react";

export default function CalendarPage() {
  const [isPopUpOpened, setIsPopUpOpened] = useState(false);
  const [popUpData, setPopUpData] = useState();
  const [popUpCalendarTime, setPopUpCalendarTime] = useState();
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [eventsByType, setEventsByType] = useState({ avaliacoes: [], eventos: [] });
  const [actualFilter, setActualFilter] = useState({ ucsFilter: [], eventsFilter: [] });
  const [nodes, setNodes] = useState([]);
  const [checked, setChecked] = useState([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  const getYearFromGroup = (groupName) => {
    const match = groupName.match(/(\d)º ano/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const processEvents = (rawData) => {
    const colors = { 1: "#3b82f6", 2: "#10b981", 3: "#8b5cf6" };
    const processed = [];

    Object.entries(rawData).forEach(([groupName, events]) => {
      const year = getYearFromGroup(groupName);
      const color = colors[year] || "#9ca3af";

      events.forEach((event) => {
        const UC = event.uc;
        
        const type = event.type || "Teste";

        const ucInfo = UCsObj.find((elem) => elem.calendar === UC);
        const semester = ucInfo ? ucInfo.semester : 0;
      

        processed.push({
          ...event,
          color,
          year,
          type,
          UC,
          semester,
        });
      });
    });

    return processed;
  };

  const mapEventsForCalendar = (events) => {
    if (!Array.isArray(events)) return [];
    return events.map((event) => ({
      title: event.UC+ ' - ' + event.type|| "Evento",
      //start: new Date(`${event.day}T${event.start}`),
      //end: new Date(`${event.day}T${event.end}`),

      start: new Date(event.day),
      end: new Date(event.day),
      color: event.color || "#9ca3af",
      extendedProps: {
        type: event.type,
        year: event.year,
        UC: event.UC,
        semester: event.semester,
      },
    }));
  };

  // 1. Fetch inicial dos eventos
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/calendar/getCalendar");
        const rawData = res.data.response || [];
        
        const processed = processEvents(rawData);

        const divideByType = processed.reduce(
          (acc, event) => {
            if (event.year !== 0) {
              acc.avaliacoes.push(event);
            } else {
              acc.eventos.push(event);
            }
            return acc;
          },
          { avaliacoes: [], eventos: [] }
        );

        setEventsByType(divideByType);
        setAllEvents(processed);
        setFilteredEvents(mapEventsForCalendar(processed));
        setIsCalendarLoading(false);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
        setIsCalendarLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const convertToNodeTree = (UCsObj) => {
      const years = [...new Set(UCsObj.map((e) => e.year))];
      return years.map((year) => {
        const semesters = [...new Set(
          UCsObj.filter((e) => e.year === year).map((e) => e.semester)
        )];
        
        const semestersArray = semesters.map((semester) => {
          const ucs = UCsObj.filter(
            (e) => e.year === year && e.semester === semester
          );
          return {
            value: `${year}ano${semester}semestre`,
            label: `${semester}º Semestre`,
            children: ucs.map((uc) => ({ 
              value: uc.calendar, 
              label: uc.name, 
              children: null 
            })),
          };
        });
        
        return { 
          value: `${year}ano`, 
          label: `${year}º Ano`, 
          children: semestersArray 
        };
      });
    };

    setNodes([
      ...convertToNodeTree(UCsObj),
      { value: null },
      { value: "eventos", label: "Eventos", children: null },
    ]);
  }, []);


  useEffect(() => {
    
    const eventsFilter = checked.includes("eventos") ? ["Evento"] : [];
    const ucsFilter = checked.filter((v) => v !== "eventos");
    
    setActualFilter({ eventsFilter, ucsFilter });
  }, [checked]);

 
  useEffect(() => {


    let filtered = [];

    if (actualFilter.ucsFilter.length > 0) {
      
      filtered = eventsByType.avaliacoes.filter((e) => 
        actualFilter.ucsFilter.includes(e.UC)
      );
     
      if (actualFilter.eventsFilter.length > 0) {
        const extra = eventsByType.eventos.filter((e) => 
          actualFilter.eventsFilter.includes(e.type)
        );
        filtered = [...filtered, ...extra];
      }
    } 
    
    else if (actualFilter.eventsFilter.length > 0) {
      
      filtered = eventsByType.eventos.filter((e) => 
        actualFilter.eventsFilter.includes(e.type)
      );
    } 
    else {
      filtered = [...eventsByType.eventos, ...eventsByType.avaliacoes];
    }

   
    setFilteredEvents(mapEventsForCalendar(filtered));
  }, [actualFilter, eventsByType]);

  const eventClickCallback = (info) => {
    setIsPopUpOpened(true);
    setPopUpCalendarTime(info.event.startStr);
    setPopUpData(info.event.extendedProps);
  };

  return (
    <div className="bg-white h-screen pt-24 flex w-full overflow-hidden relative">
      <PopUpOnClick
        isOpened={isPopUpOpened}
        setIsOpened={setIsPopUpOpened}
        data={popUpData}
        calendarData={popUpCalendarTime}
      />

      <MobileFilter
        nodes={nodes}
        checked={checked}
        onCheck={setChecked}
        className="block lg:hidden"
      />

      <div className="flex flex-row justify-center w-full lg:divide-x divide-gray-200 overflow-hidden">
        <aside className="w-[440px] hidden lg:block">
          <ScrollShadow className="h-full">
            <div className="mx-10 my-4">
              <h2 className="text-2xl font-bold p-4">Filtros</h2>
              <CheckboxTree nodes={nodes} checked={checked} onCheck={setChecked} />
            </div>
          </ScrollShadow>
        </aside>

        <div className="pt-2 px-2 lg:px-20 lg:pt-8 overflow-auto full-calendar calendar-container container">
          <h1 className="text-2xl font-bold hidden lg:block">Calendário</h1>
          {isCalendarLoading ? (
            <div className="flex justify-center items-center h-full bg-white">
              <div className="border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin" />
            </div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin]}
              locale={ptLocale}
              firstDay={0}
              eventClick={eventClickCallback}
              headerToolbar={{ 
                left: "title", 
                center: "dayGridWeek,dayGridMonth", 
                right: "prev,today,next" 
              }}
              initialView="dayGridMonth"
              displayEventTime={false}
              events={filteredEvents}
              eventTextColor="white"
              eventDisplay="block" 
              height="80vh"
            />
          )}
        </div>
      </div>
    </div>
  );
}
