"use client";
import { useId } from "react";
import { useEffect, useState } from "react";
import UCsObj from "../../data/filters.json";
import CheckboxTree from "./CheckboxTree/CheckboxTree";

export default function FilterCalendar(props) {
  const { setFinalArray, rawEvents, className } = props;
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

  return (
    <>
      <CheckboxTree
        className="w-[440px] ml-5 mt-5"
        nodes={nodes}
        checked={checked}
        onCheck={(checked) => setChecked(checked)}
      />
    </>
  );
}
