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

const isNextDay = (dateA, dateB) => {
  const d1 = new Date(dateA);
  const d2 = new Date(dateB);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  const diffInMs = d2.getTime() - d1.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays === 1;
};

const groupConsecutiveEvents = (events) => {
  if (!events || events.length === 0) return [];
  const sorted = [...events].sort((a, b) => new Date(a.day) - new Date(b.day));

  const mergedGroups = [];

  sorted.forEach((event) => {
    const lastGroup = mergedGroups[mergedGroups.length - 1];
    if (
      lastGroup &&
      lastGroup.type === event.type &&
      lastGroup.UC === event.UC &&
      isNextDay(lastGroup.endDate, event.day)
    ) {
      lastGroup.endDate = event.day;
      lastGroup.events.push(event);
    } else {
      mergedGroups.push({
        id: event.id,
        type: event.type,
        UC: event.UC,
        color: event.color,
        startDate: event.day,
        endDate: event.day,
        events: [event],
      });
    }
  });

  return mergedGroups;
};

const mapEventsForCalendar = (events) => {
  if (!Array.isArray(events)) return [];
  const groupedEvents = groupConsecutiveEvents(events);

  return groupedEvents.map((group) => {
    const title = `${group.UC} - ${group.type}`;
    const start = new Date(group.startDate);
    const end = new Date(group.endDate);
    end.setHours(end.getHours() + 1);

    const firstEvent = group.events[0];

    return {
      id: group.id,
      title,
      start,
      end,
      color: group.color || "#9ca3af",
      extendedProps: {
        time: firstEvent.start,
        type: group.type,
        year: firstEvent.year,
        UC: group.UC,
        semester: firstEvent.semester,
        isGeneral: firstEvent.isGeneral,
        mergedCount: group.events.length, 
      },
    };
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