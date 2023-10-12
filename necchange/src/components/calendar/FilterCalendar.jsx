'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";


export default function FilterCalendar(props) {
  const { setFinalArray } = props;
  const [events, setEvents] = useState({ avaliacoes: [], eventos: [] });
  const [actualFilter, setActualFilter] = useState({ yearFilter: [], typeFilter: [] });
  const [isOpened, setIsOpened] = useState({ avaliacoes: false, eventos: false, year: 0 });


  useEffect(() => {
    axios.get("/api/calendar/getCalendar").then((res) => {

      const divideByType = res.data.response.reduce((acc, uc) => {
        const { year, type } = getYearAndTypeByEvent(uc);

        if (year != 0) { 

          acc.avaliacoes.push({ ...uc, year, type });
          return acc;

        } else {

          acc.eventos.push({ ...uc, year, type });
          return acc;

        }
      }, { eventos: [], avaliacoes: [] });
      
      console.log(divideByType);
      setEvents(divideByType);
      setFinalArray([...divideByType.eventos, ...divideByType.avaliacoes]);
    });
  }, []);
  
  // This useEffect is the most important, it has all the logic to filter the events in calendar
  useEffect(() => {

    if (actualFilter.typeFilter.length == 0) {

      setFinalArray([...events.eventos, ...events.avaliacoes]);

    } else {

      if (
          actualFilter.typeFilter.includes('avaliacoes') && actualFilter.typeFilter.includes('eventos')
         ) setFinalArray([...events.eventos, ...events.avaliacoes]);
      else if (actualFilter.typeFilter.includes('avaliacoes')) setFinalArray([...events.avaliacoes]);
      else setFinalArray([...events.eventos]);
    }

    if (actualFilter.yearFilter.length != 0) {    
      const newTests = events.avaliacoes.filter((elem) => {
        return actualFilter.yearFilter.includes(elem.year) || elem.year == 0;
      });
            
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
  };


  return (
    <div className="p-6 border-r w-2/12 flex flex-col items-center">

        <div className="p-[6px] border rounded-lg w-full flex flex-row items-center justify-between mb-2">
          <div className="flex flex-row items-center">
            <input onChange={handleType} className="h-5 w-5 ml-1" type="checkbox" name="avaliacoes" id="avaliacoes"/>
            <label className="text-xl pl-2 mt-[2px]" htmlFor="avaliacoes">Avaliações</label>
          </div>
          <div onClick={() => setIsOpened({ avaliacoes: !isOpened.avaliacoes })} className="h-full w-8 flex justify-center items-center bg-black rounded-md">
            <FiChevronDown className={`cursor-pointer transition duration-500 text-3xl text-white ${isOpened.avaliacoes ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
          </div>
        </div>

        {/* Years Container */}
        <div className={`w-full flex flex-col justify-center items-center overflow-hidden transition-all duration-300 ${isOpened.avaliacoes ? 'h-[100px]' : 'h-0'}`}>
          
          <div className="p-[4px] px-3 w-11/12 flex flex-row items-center justify-between border-b">
            <div className="flex flex-row items-center">
              <input onChange={handleYear} className="h-[14px] w-[14px] ml-1" type="checkbox" name="1ano" id="1ano" />
              <label className="text-md pl-2 mt-[2px]" htmlFor="1ano">1° ano</label>
            </div>
            <FiChevronDown onClick={() => setIsOpened({ avaliacoes: true, year: 1 })} className={`cursor-pointer transition duration-300 text-xl text-black ${isOpened.year == 1 ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
          </div>
          <div className="p-[4px] px-3 w-11/12 flex flex-row items-center justify-between border-b">
            <div className="flex flex-row items-center">
              <input onChange={handleYear} className="h-[14px] w-[14px] ml-1" type="checkbox" name="2ano" id="2ano" />
              <label className="text-md pl-2 mt-[2px]" htmlFor="2ano">2° ano</label>
            </div>
            <FiChevronDown onClick={() => setIsOpened({ avaliacoes: true, year: 2 })} className={`cursor-pointer transition duration-300 text-xl text-black ${isOpened.year == 2 ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
          </div>
          <div className="p-[4px] px-3 w-11/12 flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <input onChange={handleYear} className="h-[14px] w-[14px] ml-1" type="checkbox" name="3ano" id="3ano" />
              <label className="text-md pl-2 mt-[2px]" htmlFor="3ano">3° ano</label>
            </div>
            <FiChevronDown onClick={() => setIsOpened({ avaliacoes: true, year: 3 })} className={`cursor-pointer transition duration-300 text-xl text-black ${isOpened.year == 3 ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
          </div>
        </div>

        {/* Eventos Container */}
        <div className="p-[6px] border rounded-lg w-full flex flex-row items-center justify-between mt-2">
          <div className="flex flex-row items-center">
            <input onChange={handleType} className="h-5 w-5 ml-1" type="checkbox" name="eventos" id="eventos"/>
            <label className="text-xl pl-2 mt-[2px]" htmlFor="eventos">Eventos</label>
          </div>
          <div onClick={() => setIsOpened({ eventos: !isOpened.eventos })} className="h-full w-8 flex justify-center items-center bg-black rounded-md">
            <FiChevronDown className={`cursor-pointer transition duration-300 text-3xl text-white ${isOpened.eventos ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
          </div>
        </div>

    </div>
  )
}