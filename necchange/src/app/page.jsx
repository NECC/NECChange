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

const normalize = (str) =>
  (str ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // strip accents

const findUCInfo = (UC) => {
  const target = normalize(UC);
  if (!target) return null;
  return (
    UCsObj.find(
      (elem) =>
        normalize(elem.calendar) === target ||
        normalize(elem.name) === target ||
        normalize(elem.sigla) === target
    ) || null
  );
};

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
    const colors = { 1: "#3b82f6", 2: "#10b981", 3: "#8b5cf6", 0: "#ff0000" };
    const processed = [];

    Object.entries(rawData).forEach(([groupName, events]) => {
      const year = getYearFromGroup(groupName);
      const color = colors[year] || "#9ca3af";

      events.forEach((event, idx) => {
        const UC = event.uc;
        const type = event.type || "Teste";

        const ucInfo = findUCInfo(UC);
        const semester = ucInfo ? (ucInfo.semester ?? 0) : 0;

        const isGeneral = ucInfo ? ucInfo.year === 0 : false;

        if (!ucInfo) {
          console.warn(
            `[CalendarPage] No UCsObj match found for event.uc="${UC}" (group: ${groupName})`
          );
        }

        processed.push({
          ...event,
          id: `${groupName}-${idx}-${UC ?? "no-uc"}-${event.day ?? ""}`,
          color,
          year,
          type,
          UC,
          semester,
          isGeneral,
        });
      });
    });

    return processed;
  };

  // const mapEventsForCalendar = (events) => {
  //   if (!Array.isArray(events)) return [];

  //   return events.map((event) => {
  //     const examTypes = ["Teste", "Exame", "Mini-Teste", "Entrega", "Evento", "WORKSHOP", "TALK", "TERTULIA", "OTHER"];
  //     const eventSpecial = ["Instalar Linux"];

  //     const isExam = examTypes.includes(event.type);
  //     const isLip = eventSpecial.includes(event.type);

  //     // Adds `days` business days to a date, skipping Saturdays and Sundays
  //     const addBusinessDays = (startDate, days) => {
  //       const result = new Date(startDate);
  //       let added = 0;
  //       while (added < days) {
  //         result.setDate(result.getDate() + 1);
  //         const dayOfWeek = result.getDay(); // 0 = Sunday, 6 = Saturday
  //         if (dayOfWeek !== 0 && dayOfWeek !== 6) {
  //           added++;
  //         }
  //       }
  //       return result;
  //     };

  //     const endDate = isExam
  //       ? new Date(event.day)
  //       : isLip
  //       ? addBusinessDays(new Date(event.day), /* your custom count */ 4)
  //       : addBusinessDays(new Date(event.day), 4);

  //     return {
  //       id: event.id,
  //       title: (event.UC + " - " + event.type) || "Evento",
  //       start: new Date(event.day),
  //       end: endDate,
  //       color: event.color || "#9ca3af",
  //       extendedProps: {
  //         time: event.start,
  //         type: event.type,
  //         year: event.year,
  //         UC: event.UC,
  //         semester: event.semester,
  //         isGeneral: event.isGeneral,
  //       },
  //     };
  //   });
  // };


const getBusinessDaysRange = (startDate, count) => {
  const result = [new Date(startDate)];
  const cursor = new Date(startDate);
  let added = 0;
  while (added < count) {
    cursor.setDate(cursor.getDate() + 1);
    const dayOfWeek = cursor.getDay(); // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      result.push(new Date(cursor));
      added++;
    }
  }
  return result;
};
const groupConsecutiveDays = (days) => {
  if (days.length === 0) return [];
  const runs = [[days[0]]];
  for (let i = 1; i < days.length; i++) {
    const lastRun = runs[runs.length - 1];
    const prevDay = lastRun[lastRun.length - 1];
    const diffDays = Math.round((days[i] - prevDay) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      lastRun.push(days[i]);
    } else {
      runs.push([days[i]]);
    }
  }
  return runs;
};

const mapEventsForCalendar = (events) => {
  if (!Array.isArray(events)) return [];

  const examTypes = ["Teste", "Exame", "Mini-Teste", "Entrega", "Evento", "WORKSHOP", "TALK", "TERTULIA", "OTHER"];

  return events.flatMap((event) => {
    const isExam = examTypes.includes(event.type);

    const title = (event.UC + " - " + event.type) || "Evento";
    const extendedProps = {
      time: event.start,
      type: event.type,
      year: event.year,
      UC: event.UC,
      semester: event.semester,
      isGeneral: event.isGeneral,
    };
    const color = event.color || "#9ca3af";

    if (isExam) {
      const end = new Date(event.day);
      end.setHours(end.getHours() + 1);
      return [
        {
          id: event.id,
          title,
          start: new Date(event.day),
          end,
          color,
          extendedProps,
        },
      ];
    }

    const days = getBusinessDaysRange(new Date(event.day), 4);
    const runs = groupConsecutiveDays(days);

    return runs.map((run, idx) => {
      const start = new Date(run[0]);
      const end = new Date(run[run.length - 1]);
      end.setDate(end.getDate());
      end.setHours(end.getHours() + 1);

      return {
        id: `${event.id}-run${idx}`,
        title,
        start,
        end,
        color,
        extendedProps,
      };
    });
  });
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
      const years = [
        ...new Set(
          UCsObj
            .map((e) => e.year)
            .filter((year) => year !== 0)
        ),
      ];

      const yearNodes = years.map((year) => {
        const semesters = [
          ...new Set(
            UCsObj
              .filter((e) => e.year === year)
              .map((e) => e.semester)
          ),
        ];

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
              children: null,
            })),
          };
        });

        return {
          value: `${year}ano`,
          label: `${year}º Ano`,
          children: semestersArray,
        };
      });

      const eventUCs = UCsObj.filter(
        (e) => e.year === 0
      ).map((uc) => ({
        value: uc.calendar,
        label: uc.name,
        children: null,
      }));

      return { yearNodes, eventUCs };
    };

    const { yearNodes, eventUCs } = convertToNodeTree(UCsObj);

    setNodes([
      ...yearNodes,
      {
        value: "eventos",
        label: "Eventos",
        children: eventUCs.length > 0 ? eventUCs : null,
      },
    ]);
  }, []);

  useEffect(() => {
    const eventsFilter = checked.includes("eventos") ? ["Evento"] : [];
    const ucsFilter = checked.filter((v) => v !== "eventos");
    setActualFilter({ eventsFilter, ucsFilter });
  }, [checked]);

  useEffect(() => {
    const isEventosCategoryChecked = checked.includes("eventos");
    const selectedUCsOrEvents = checked.filter((v) => v !== "eventos");

    let filtered = [];

    if (selectedUCsOrEvents.length > 0) {
      const selectedAvaliacoes = eventsByType.avaliacoes.filter((e) =>
        selectedUCsOrEvents.includes(e.UC)
      );

      const selectedEventItems = eventsByType.eventos.filter((e) =>
        selectedUCsOrEvents.includes(e.UC) || selectedUCsOrEvents.includes(e.calendar)
      );

      const combinedMap = new Map(
        [...selectedAvaliacoes, ...selectedEventItems].map((e) => [e.id, e])
      );

      if (isEventosCategoryChecked) {
        const allGeneralEvents = eventsByType.eventos.filter((e) => e.isGeneral);
        allGeneralEvents.forEach((e) => combinedMap.set(e.id, e));
      }

      filtered = Array.from(combinedMap.values());
    } else if (isEventosCategoryChecked) {
      filtered = eventsByType.eventos.filter((e) => e.isGeneral);
    } else {
      filtered = [...eventsByType.eventos, ...eventsByType.avaliacoes];
    }

    setFilteredEvents(mapEventsForCalendar(filtered));
  }, [checked, eventsByType]);

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
                right: "prev,today,next",
              }}
              initialView="dayGridMonth"
              displayEventTime={false}
              events={filteredEvents}
              eventTextColor="white"
              eventDisplay="block"
              eventClassNames="text-center"
              height="80vh"
            />
          )}
        </div>
      </div>
    </div>
  );
}