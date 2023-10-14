'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import UCsObj from '../../data/filters.json'

export default function FilterCalendar(props) {
  const { setFinalArray } = props;
  const [events, setEvents] = useState({ avaliacoes: [], eventos: [] });
  const [actualFilter, setActualFilter] = useState({ typeFilter: [], UcsFilter: [] });
  const [isOpened, setIsOpened] = useState({ avaliacoes: true, eventos: false, year: 1 });

  useEffect(() => {
    axios.get("/api/calendar/getCalendar").then((res) => {

      const divideByType = res.data.response.reduce((acc, uc) => {
        const { year, type, UC, semester } = getYearAndTypeByEvent(uc);

        if (year != 0) { 

          acc.avaliacoes.push({ ...uc, year, type, UC, semester });
          return acc;

        } else {

          acc.eventos.push({ ...uc, year, type, UC, semester });
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
      if (actualFilter.typeFilter.includes('avaliacoes') && actualFilter.typeFilter.includes('eventos')) {
        setFinalArray([...events.eventos, ...events.avaliacoes]); 
      } else if (actualFilter.typeFilter.includes('avaliacoes')) {
        setFinalArray([...events.avaliacoes])
      } 
      else {
        setFinalArray([...events.eventos]);
      }
    }

    if (actualFilter.UcsFilter.length > 0) {
      const newTests = events.avaliacoes.filter((elem) => {
        return actualFilter.UcsFilter.includes(elem.UC);
      })

      if (actualFilter.typeFilter.includes('eventos')) {
        setFinalArray([...newTests, ...events.eventos])
      } else {
        setFinalArray([...newTests]);
      }
    }


    
  }, [actualFilter.typeFilter, actualFilter.UcsFilter]);

  const handleYear = (e) => {
    const year = Number((e.target.id).charAt(0));

    const newUcs = UCsObj.filter((elem) => {
      return elem.year == year;
    }).map((elem) => elem.calendar);

    const finalArrayUcs = [...new Set([...actualFilter.UcsFilter, ...newUcs])];

    // true - Every uc is selected
    // false - There are UCs that aren't selected
    const res = finalArrayUcs.every((elem) => actualFilter.UcsFilter.includes(elem));

    // This condition will filter the array if all UCs from a year were selected before
    // If weren't, all UCs from the given year will be selected
    if (res) {
      const newArray = actualFilter.UcsFilter.filter((uc) => !newUcs.includes(uc));
      console.log(newArray)
      setActualFilter({ typeFilter: actualFilter.typeFilter, UcsFilter: newArray });
    } else {
      setActualFilter({ typeFilter: actualFilter.typeFilter, UcsFilter: finalArrayUcs });
    }
  }

  const handleType = (e) => {
    const type = e.target.id;

    if (actualFilter.typeFilter.includes(type)) {
      const newArray = actualFilter.typeFilter.filter((t) => t != type);
      setActualFilter({ typeFilter: newArray, UcsFilter: actualFilter.UcsFilter});
    } else {
      const newArray = [...actualFilter.typeFilter, type];
      setActualFilter({ typeFilter: newArray, UcsFilter: actualFilter.UcsFilter });
    }
  }

  const handleUc = (e) => {
    const uc = e.target.id;
    console.log(actualFilter);

    if (actualFilter.UcsFilter.includes(uc)) {
      const newArray = actualFilter.UcsFilter.filter((t) => t != uc);
      setActualFilter({ UcsFilter: newArray, typeFilter: actualFilter.typeFilter });
    } else {
      const newArray = [...actualFilter.UcsFilter, uc];
      setActualFilter({ UcsFilter: newArray, typeFilter: actualFilter.typeFilter });
    }
  }

  const getYearAndTypeByEvent = (event) => {
    const yearRegexp = event.title.match(/\((1|2|3)º ano\)/)
    const matches = event.title.match(/\b(Teste|Exame|Entrega)\b/);
    
    const result = {
      type: null,
      year: null,
      semester: null,
      UC: null,
    };
    
    if (matches) {
      const UC = event.title.split(" ")[0];

      matches.forEach(match => {
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
      result.type = 'Evento';
      result.year = 0;
      result.semester = 0;
      result.UC = '';
    }

    return result;
  };


  return (
    <div className="p-6 border-r w-3/12 flex flex-col items-center">

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
        <div className={`w-full flex flex-col justify-center items-center overflow-hidden transition-all duration-300 ${isOpened.avaliacoes ? '' : 'hidden'}`}>
          
          <div className={`p-[4px] pb-2 transition-all duration-200 overflow-hidden px-3 w-11/12 flex flex-col items-center justify-between border-b ${isOpened.year == 1 ? 'h-[425px]' : 'h-[30px]'}`}>
            <div className="flex flex-row justify-between items-center w-full">
              <div>
                <input onChange={handleYear} className="h-[14px] w-[14px] ml-1" type="checkbox" name="1ano" id="1ano" />
                <label className="text-md pl-2 mt-[2px]" htmlFor="1ano">1° ano</label>
              </div>
            <FiChevronDown onClick={() => setIsOpened({ avaliacoes: true, year: 1 })} className={`cursor-pointer transition duration-300 text-xl text-black ${isOpened.year == 1 ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
            </div>

            <h1 className="w-full pl-2 border-b m-2 text-lg"><strong>1° Semestre</strong></h1>

            <div className="w-11/12">
              {UCsObj.map((uc) => {
                if (uc.year == 1 && uc.semester == 1) {
                  return (
                  <div key={uc.calendar} className="flex flex-row items-center">
                    <input onChange={handleUc} className="h-[14px] w-[14px] ml-1" type="checkbox" name={uc.calendar} id={uc.calendar} />
                    <label className="text-md pl-2 mt-[2px]" htmlFor={uc.calendar}>{uc.name}</label>
                  </div>  
                )
                }
            })}
            </div>            

            <h1 className="w-full pl-2 border-b m-2 text-lg"><strong>2° Semestre</strong></h1>

            <div className="w-11/12">
              {UCsObj.map((uc) => {
                if (uc.year == 1 && uc.semester == 2) {
                  return (
                  <div key={uc.calendar} className="flex flex-row items-center">
                    <input onChange={handleUc} className="h-[14px] w-[14px] ml-1" type="checkbox" name={uc.calendar} id={uc.calendar} />
                    <label className="text-md pl-2 mt-[2px]" htmlFor={uc.calendar}>{uc.name}</label>
                  </div>  
                )
                }
            })}
            </div>            
          </div>



          <div className={`p-[4px] pb-2 transition-all duration-200 overflow-hidden px-3 w-11/12 flex flex-col items-center justify-between border-b ${isOpened.year == 2 ? 'h-[425px]' : 'h-[30px]'}`}>
            <div className="flex flex-row justify-between items-center w-full">
              <div>
                <input onChange={handleYear} className="h-[14px] w-[14px] ml-1" type="checkbox" name="2ano" id="2ano" />
                <label className="text-md pl-2 mt-[2px]" htmlFor="2ano">2° ano</label>
              </div>
              <FiChevronDown onClick={() => setIsOpened({ avaliacoes: true, year: 2 })} className={`cursor-pointer transition duration-300 text-xl text-black ${isOpened.year == 2 ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
            </div>

            <h1 className="w-full pl-2 border-b m-2 text-lg"><strong>1° Semestre</strong></h1>

            <div className="w-11/12">
              {UCsObj.map((uc) => {
                if (uc.year == 2 && uc.semester == 1) {
                  return (
                  <div key={uc.calendar} className="flex flex-row items-center">
                    <input onChange={handleUc} className="h-[14px] w-[14px] ml-1" type="checkbox" name={uc.calendar} id={uc.calendar} />
                    <label className="text-md pl-2 mt-[2px]" htmlFor={uc.calendar}>{uc.name}</label>
                  </div>  
                )
                }
            })}
            </div>            

            <h1 className="w-full pl-2 border-b m-2 text-lg"><strong>2° Semestre</strong></h1>

            <div className="w-11/12">
              {UCsObj.map((uc) => {
                if (uc.year == 2 && uc.semester == 2) {
                  return (
                  <div key={uc.calendar} className="flex flex-row items-center">
                    <input onChange={handleUc} className="h-[14px] w-[14px] ml-1" type="checkbox" name={uc.calendar} id={uc.calendar} />
                    <label className="text-md pl-2 mt-[2px]" htmlFor={uc.calendar}>{uc.name}</label>
                  </div>  
                )
                }
            })}
            </div>   

          </div>

          <div className={`p-[4px] pb-2 transition-all duration-200 overflow-hidden px-3 w-11/12 flex flex-col items-center justify-between border-b ${isOpened.year == 3 ? 'h-[425px]' : 'h-[30px]'}`}>
            <div className="flex flex-row justify-between items-center w-full">
              <div>
                <input onChange={handleYear} className="h-[14px] w-[14px] ml-1" type="checkbox" name="3ano" id="3ano" />
                <label className="text-md pl-2 mt-[2px]" htmlFor="3ano">3° ano</label>
              </div>
              <FiChevronDown onClick={() => setIsOpened({ avaliacoes: true, year: 3 })} className={`cursor-pointer transition duration-300 text-xl text-black ${isOpened.year == 3 ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
            </div>

            <h1 className="w-full pl-2 border-b m-2 text-lg"><strong>1° Semestre</strong></h1>

            <div className="w-11/12">
              {UCsObj.map((uc) => {
                if (uc.year == 3 && uc.semester == 1) {
                  return (
                  <div key={uc.calendar} className="flex flex-row items-center">
                    <input onChange={handleUc} className="h-[14px] w-[14px] ml-1" type="checkbox" name={uc.calendar} id={uc.calendar} />
                    <label className="text-md pl-2 mt-[2px]" htmlFor={uc.calendar}>{uc.name}</label>
                  </div>  
                )
                }
            })}
            </div>            

            <h1 className="w-full pl-2 border-b m-2 text-lg"><strong>2° Semestre</strong></h1>

            <div className="w-11/12">
              {UCsObj.map((uc) => {
                if (uc.year == 3 && uc.semester == 2) {
                  return (
                  <div key={uc.calendar} className="flex flex-row items-center">
                    <input onChange={handleUc} className="h-[14px] w-[14px] ml-1" type="checkbox" name={uc.calendar} id={uc.calendar} />
                    <label className="text-md pl-2 mt-[2px]" htmlFor={uc.calendar}>{uc.name}</label>
                  </div>  
                )
                }
            })}
            </div>   

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