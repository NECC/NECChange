"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import ptLocale from "@fullcalendar/core/locales/pt";
import { useState, useEffect, use } from "react";
import axios from "axios";
import MobileFilter from "@/components/calendar/MobileFilter";
import UCsObj from "../data/filters.json";
import CheckboxTree from "@/components/calendar/CheckboxTree/CheckboxTree";
import PopUpOnClick from "@/components/calendar/PopUpOnClick";

export default function CalendarPage() {
  const [isPopUpOpened, setIsPopUpOpened] = useState(false);
  const [popUpData, setPopUpData] = useState();
  const [popUpCalendarTime, setPopUpCalendarTime] = useState();
  const [finalArray, setFinalArray] = useState([]);
  const [rawEvents, setRawEvents] = useState([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);
  const [events, setEvents] = useState({ avaliacoes: [], eventos: [] });
  const [actualFilter, setActualFilter] = useState({
    ucsFilter: [],
    eventsFilter: [],
  });
  const [nodes, setNodes] = useState([]);
  const [checked, setChecked] = useState([]);

  const getYearAndTypeByEvent = (event) => {
    const yearRegexp = event.title.match(/\((1|2|3)º ano\)/);
    const matches = event.title.match(/\b(Teste|Exame|Entrega)\b/);

    const result = {
      type: null,
      year: null,
      semester: null,
      UC: null,
    };

    if (matches) {
      const UC = event.title.split(" ")[0];

      matches.forEach((match) => {
        if (match === "Teste" || match === "Exame" || match === "Entrega") {
          result.type = match;
        }

        if (yearRegexp) {
          result.year = Number(yearRegexp[1]);
        }

        result.UC = UC;
        result.semester = UCsObj.find((elem) => {
          return elem.calendar == UC;
        }).semester;
      });
    }

    if (!result.type && !result.year && !result.UC) {
      result.type = "Evento";
      result.year = 0;
      result.semester = 0;
      result.UC = "";
    }

    return result;
  };

  useEffect(() => {
    axios.get("/api/calendar/getCalendar").then((res) => {
      setRawEvents(res.data.response);
      setFinalArray(res.data.response);
      setIsCalendarLoading(false);
    });
  }, []);

  useEffect(() => {
    const divideByType = rawEvents.reduce(
      (acc, uc) => {
        const { year, type, UC, semester } = getYearAndTypeByEvent(uc);

        if (year != 0) {
          acc.avaliacoes.push({ ...uc, year, type, UC, semester });
          return acc;
        } else {
          acc.eventos.push({ ...uc, year, type, UC, semester });
          return acc;
        }
      },
      { eventos: [], avaliacoes: [] }
    );

    setEvents(divideByType);
  }, [rawEvents]);

  useEffect(() => {
    if (actualFilter.ucsFilter.length > 0) {
      const newTests = events.avaliacoes.filter((elem) => {
        return actualFilter.ucsFilter.includes(elem.UC);
      });

      if (actualFilter.eventsFilter.length > 0) {
        const newEvents = events.eventos.filter((elem) => {
          return actualFilter.eventsFilter.includes(elem.type);
        });

        setFinalArray([...newEvents, ...newTests]);
      } else setFinalArray([...newTests]);
    } else if (actualFilter.eventsFilter.length > 0) {
      setFinalArray([...events.eventos]);
    } else {
      // no filtering
      setFinalArray([...events.eventos, ...events.avaliacoes]);
    }
  }, [actualFilter, events, setFinalArray]);

  useEffect(() => {
    if (checked.includes("eventos")) {
      setActualFilter((e) => ({ ...e, eventsFilter: ["Evento"] }));
    } else {
      setActualFilter((e) => ({ ...e, eventsFilter: [] }));
    }
    setActualFilter((e) => ({ ...e, ucsFilter: checked }));
  }, [checked]);

  useEffect(() => {
    // i have an array of objects called UCsObj, that has the following structure: {name: "Análise e Síntese de Algoritmos", calendar: "ASA", year: 2, semester: 1},
    // and i want to convert it to a node tree, where each node has the following structure: {id: "1ano", children: [{id: "1ano1semestre", children: [{id: "ASA", children: []}]}]}

    const convertToNodeTree = (UCsObj) => {
      const years = [...new Set(UCsObj.map((elem) => elem.year))];

      const yearsArray = years.map((year) => {
        // same as semesters = [1, 2]
        const semesters = [
          ...new Set(
            UCsObj.filter((elem) => elem.year == year).map(
              (elem) => elem.semester
            )
          ),
        ];

        const semestersArray = semesters.map((semester) => {
          const ucs = UCsObj.filter(
            (elem) => elem.year == year && elem.semester == semester
          );

          const ucsArray = ucs.map((uc) => {
            return { value: uc.calendar, label: uc.name, children: null };
          });

          return {
            value: `${year}ano${semester}semestre`,
            label: `${semester}º Semestre`,
            children: ucsArray,
          };
        });

        return {
          value: `${year}ano`,
          label: `${year}º Ano`,
          children: semestersArray,
        };
      });

      return yearsArray;
    };
    setNodes([
      ...convertToNodeTree(UCsObj),
      { value: `eventos`, label: `Eventos`, children: null },
    ]);
  }, []);

  const eventClickCallback = (info) => {
    setIsPopUpOpened(!isPopUpOpened);
    setPopUpCalendarTime(info.event.startStr);
    setPopUpData(info.event.extendedProps);
  };

  return (
    <div className="bg-white min-h-screen pt-24 flex w-full overflow-hidden relative">
      <CheckboxTree
        className={`w-[440px] ml-5 mt-5 lg:block hidden`}
        nodes={nodes}
        checked={checked}
        onCheck={(checked) => setChecked(checked)}
      />

      <PopUpOnClick
        isOpened={isPopUpOpened}
        setIsOpened={setIsPopUpOpened}
        data={popUpData}
        calendarData={popUpCalendarTime}
      />

      <MobileFilter
        nodes={nodes}
        checked={checked}
        onCheck={(checked) => setChecked(checked)}
        className="block lg:hidden"
      />

      <div className="pt-8 px-2 md:px-8 overflow-y-scroll full-calendar calendar-container container mx-auto">
        {isCalendarLoading ? (
          <div className="flex justify-center items-center h-full bg-white">
            <div className="border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin">
              {" "}
            </div>
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, googleCalendarPlugin]}
            locale={ptLocale}
            firstDay={0}
            eventClick={eventClickCallback}
            headerToolbar={{
              left: "prev,today,next",
              center: "title",
              right: "dayGridWeek,dayGridMonth",
            }}
            initialView="dayGridMonth"
            displayEventTime={false}
            events={finalArray}
            eventColor="blue-sky-500"
            event
            height="80vh"
          />
        )}
      </div>
    </div>
  );
}
