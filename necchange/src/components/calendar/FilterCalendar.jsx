'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import UCsObj from '../../data/filters.json'
import CustomCheckbox from "./CustomCheckbox";

// TODO: acho que tb podíamos tentar meter os filtros um bocado mais bonitos em termos de cor e assim
// TODO: Code clean up

export default function FilterCalendar(props) {
  const { setFinalArray, rawEvents } = props;
  const [events, setEvents] = useState({ avaliacoes: [], eventos: [] });
  const [actualFilter, setActualFilter] = useState({ UcsFilter: [], eventsFilter: [] });
  const [isOpened, setIsOpened] = useState({ avaliacoes: true, eventos: false, year: 0, semester: 0 });

  useEffect(() => {
    const divideByType = rawEvents.reduce((acc, uc) => {
      const { year, type, UC, semester } = getYearAndTypeByEvent(uc);

      if (year != 0) { 

        acc.avaliacoes.push({ ...uc, year, type, UC, semester });
        return acc;

      } else {

        acc.eventos.push({ ...uc, year, type, UC, semester });
        return acc;

      }
    }, { eventos: [], avaliacoes: [] });
    
    // console.log(divideByType);
    setEvents(divideByType);
  }, [rawEvents])

  // This useEffect is the most important, it has all the logic to filter the events in calendar
  useEffect(() => {

    if (actualFilter.UcsFilter.length > 0) {
      const newTests = events.avaliacoes.filter((elem) => {
        return actualFilter.UcsFilter.includes(elem.UC);
      })

      if (actualFilter.eventsFilter.length > 0) {
        const newEvents = events.eventos.filter((elem) => {
          return actualFilter.eventsFilter.includes(elem.type);
        });

        setFinalArray([ ...newEvents, ...newTests ]);
      } else setFinalArray([ ...newTests ]);

    } else if (actualFilter.eventsFilter.length > 0) {
      setFinalArray([ ...events.eventos ]);
    }
    else {
      // no filtering
      setFinalArray([...events.eventos, ...events.avaliacoes]);
    }
    
  }, [actualFilter.UcsFilter, actualFilter.eventsFilter]);

  const handleYear = (id) => {
    const year = Number(id.charAt(0));

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
      setActualFilter({ ...actualFilter, UcsFilter: newArray });
    } else {
      setActualFilter({ ...actualFilter, UcsFilter: finalArrayUcs });
    }
  }
  
  const handleSemester = (id) => {
    // XanoYsemestre
    const semester = Number(id.charAt(4));
    const year = Number(id.charAt(0));
    
    const newUcs = UCsObj.filter((elem) => {
      return elem.year == year && elem.semester == semester;
    }).map((elem) => elem.calendar);

    const finalArrayUcs = [...new Set([...actualFilter.UcsFilter, ...newUcs])];

    // true - Every uc is selected
    // false - There are UCs that aren't selected
    const res = finalArrayUcs.every((elem) => actualFilter.UcsFilter.includes(elem));
    
    // This condition will filter the array if all UCs from a year were selected before
    // If weren't, all UCs from the given year will be selected
    if (res) {
      const newArray = actualFilter.UcsFilter.filter((uc) => !newUcs.includes(uc));
      setActualFilter({ ...actualFilter, UcsFilter: newArray });
    } else {
      setActualFilter({ ...actualFilter, UcsFilter: finalArrayUcs });
    }

  }

  const handleType = (type) => {
    const allUcsLength = (UCsObj.map((elem) => elem.calendar)).length;
    const allUcsArray = UCsObj.map((elem) => elem.calendar)
    // console.log("All ucs length: ", allUcsLength);
    // console.log("Actual filter length: ", actualFilter.UcsFilter.length)
    // console.log(actualFilter.UcsFilter)

    if (type == 'avaliacoes') {
      if (actualFilter.UcsFilter.length == 0) {
        setActualFilter({ ...actualFilter, UcsFilter: [ ...allUcsArray ]});
      } else if (actualFilter.UcsFilter.length == allUcsLength) {
        setActualFilter({ ...actualFilter, UcsFilter: []});
      } else {
        setActualFilter({ ...actualFilter, UcsFilter: []});        
      }
    }
  }

  const handleUc = (id) => {
    const uc = id;

    if (actualFilter.UcsFilter.includes(uc)) {
      const newArray = actualFilter.UcsFilter.filter((t) => t != uc);
      setActualFilter({ ...actualFilter, UcsFilter: newArray });
    } else {
      const newArray = [...actualFilter.UcsFilter, uc];
      setActualFilter({ ...actualFilter, UcsFilter: newArray });
    }

  }

  const handleEvents = () => {
    if (actualFilter.eventsFilter.includes('Evento')) {
      setActualFilter({ ...actualFilter, eventsFilter: [] });
    } else {
      setActualFilter({ ...actualFilter, eventsFilter: ['Evento'] });
    }

    console.log(actualFilter);
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

  const handleOpenedYear = (year) => {
    if (isOpened.year == year) setIsOpened({...isOpened, year: 0 });
    else setIsOpened({...isOpened, year });
  }
  
  const handleOpenedSemester = (semester) => {
    if (isOpened.semester == semester) setIsOpened({...isOpened, semester: 0 });
    else setIsOpened({...isOpened, semester });    
  }

  return (
    <div className="p-6 border-r w-3/12 flex flex-col items-center">

        <div className="p-[6px] border rounded-lg w-full flex flex-row items-center justify-between mb-2">
          <div className="flex flex-row items-center">
            <CustomCheckbox id="avaliacoes" array={actualFilter.UcsFilter} handle={handleType} scope="type" style="w-[20px] h-[20px]"/>
            <label onClick={() => handleType('avaliacoes')} className="text-xl pl-2 mt-[2px]" htmlFor="avaliacoes">Avaliações</label>
          </div>
          <div onClick={() => setIsOpened({ avaliacoes: !isOpened.avaliacoes })} className="h-full w-8 flex justify-center items-center bg-black rounded-md">
            <FiChevronDown className={`cursor-pointer transition duration-500 text-3xl text-white ${isOpened.avaliacoes ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
          </div>
        </div>

        {/* Years Container */}
        <div className={`w-full flex flex-col justify-center items-center overflow-hidden transition-all duration-300 ${isOpened.avaliacoes ? '' : 'hidden'}`}>
          
          <div className={`p-[4px] pb-2 transition-all duration-200 overflow-hidden px-3 w-11/12 flex flex-col items-center justify-start border-b ${isOpened.year == 1 ? isOpened.semester == 1 ? 'h-[250px]' : isOpened.semester == 2 ? 'h-[280px]' : 'h-[108px]' : 'h-[40px]'}`}>
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-row items-center">
                <CustomCheckbox style="w-[18px] h-[18px]" id="1ano" array={actualFilter.UcsFilter} handle={handleYear} scope="year"/>
                <label onClick={() => handleYear('1ano')} className="text-md pl-2 mt-[2px]" htmlFor="1ano">1° ano</label>
              </div>
            <FiChevronDown onClick={() => handleOpenedYear(1)} className={`cursor-pointer transition duration-300 text-xl text-black ${isOpened.year == 1 ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
            </div>

            <div className="flex flex-row justify-between items-center w-full">
              <div className="w-full pl-1 mt-2 text-lg flex items-center">              
                <CustomCheckbox style="w-[16px] h-[16px]" id="1ano1semestre" array={actualFilter.UcsFilter} handle={handleSemester} scope="semester"/>
                <h1 className="pl-2"><strong>1° Semestre</strong></h1>
              </div>
            <FiChevronDown onClick={() => handleOpenedSemester(1)} className={`cursor-pointer transition duration-300 text-xl text-black ${isOpened.semester == 1 ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
            </div>


            <div className={`w-11/12 ${isOpened.semester == 1 ? 'block' : 'hidden'} mt-1`}>
              {UCsObj.map((uc) => {
                if (uc.year == 1 && uc.semester == 1) {
                  return (
                  <div key={uc.calendar} className="flex flex-row items-center">
                    <CustomCheckbox style="w-[16px] h-[16px]" id={uc.calendar} array={actualFilter.UcsFilter} handle={handleUc} scope="uc"/>
                    <label className="text-md pl-2 mt-[2px]" htmlFor={uc.calendar}>{uc.name}</label>
                  </div>  
                )
                }
            })}
            </div>            

            <div className="flex flex-row justify-between items-center w-full">
              <div className="w-full pl-1 mt-2 text-lg flex items-center">              
                <CustomCheckbox style="w-[16px] h-[16px]" id="1ano2semestre" array={actualFilter.UcsFilter} handle={handleSemester} scope="semester"/>
                <h1 className="pl-2"><strong>2° Semestre</strong></h1>
              </div>
            <FiChevronDown onClick={() => handleOpenedSemester(2)} className={`cursor-pointer transition duration-300 text-xl text-black ${isOpened.semester == 2 ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
            </div>

            <div className={`w-11/12 ${isOpened.semester == 2 ? 'block' : 'hidden'} mt-2`}>
              {UCsObj.map((uc) => {
                if (uc.year == 1 && uc.semester == 2) {
                  return (
                  <div key={uc.calendar} className="flex flex-row items-center">
                    <CustomCheckbox style="w-[16px] h-[16px]" id={uc.calendar} array={actualFilter.UcsFilter} handle={handleUc} scope="uc"/>
                    <label className="text-md pl-2 mt-[2px]" htmlFor={uc.calendar}>{uc.name}</label>
                  </div>  
                )
                }
            })}
            </div>            
          </div>



          <div className={`p-[4px] pt-2 pb-2 transition-all duration-200 overflow-hidden px-3 w-11/12 flex flex-col items-center justify-start border-b ${isOpened.year == 2 ? isOpened.semester == 1 ? 'h-[250px]' : isOpened.semester == 2 ? 'h-[280px]' : 'h-[115px]' : 'h-[40px]'} `}>
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex justify-center items-center">
                <CustomCheckbox style="w-[18px] h-[18px]" id="2ano" array={actualFilter.UcsFilter} handle={handleYear} scope="year"/>
                <label onClick={() => handleYear('2ano')} className="text-md pl-2 mt-[2px]" htmlFor="2ano">2° ano</label>
              </div>
              <FiChevronDown onClick={() => handleOpenedYear(2)} className={`cursor-pointer transition duration-300 text-xl text-black ${isOpened.year == 2 ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
            </div>

            <div className="flex flex-row justify-between items-center w-full">
              <div className="w-full pl-1 mt-2 text-lg flex items-center">              
                <CustomCheckbox style="w-[16px] h-[16px]" id="2ano1semestre" array={actualFilter.UcsFilter} handle={handleSemester} scope="semester"/>
                <h1 className="pl-2"><strong>1° Semestre</strong></h1>
              </div>
            <FiChevronDown onClick={() => handleOpenedSemester(1)} className={`cursor-pointer transition duration-300 text-xl text-black ${isOpened.semester == 1 ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
            </div>

            <div className={`w-11/12 ${isOpened.semester == 1 ? 'block' : 'hidden'} mt-2`}>
              {UCsObj.map((uc) => {
                if (uc.year == 2 && uc.semester == 1) {
                  return (
                  <div key={uc.calendar} className="flex flex-row items-center">
                    <CustomCheckbox style="w-[16px] h-[16px]" id={uc.calendar} array={actualFilter.UcsFilter} handle={handleUc} scope="uc"/>
                    <label className="text-md pl-2 mt-[2px]" htmlFor={uc.calendar}>{uc.name}</label>
                  </div>  
                )
                }
            })}
            </div>            

            <div className="flex flex-row justify-between items-center w-full">
              <div className="w-full pl-1 mt-2 text-lg flex items-center">              
                <CustomCheckbox style="w-[16px] h-[16px]" id="2ano2semestre" array={actualFilter.UcsFilter} handle={handleSemester} scope="semester"/>
                <h1 className="pl-2"><strong>2° Semestre</strong></h1>
              </div>
            <FiChevronDown onClick={() => handleOpenedSemester(2)} className={`cursor-pointer transition duration-300 text-xl text-black ${isOpened.semester == 2 ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
            </div>

            <div className={`w-11/12 ${isOpened.semester == 2 ? 'block' : 'hidden'} mt-2`}>
              {UCsObj.map((uc) => {
                if (uc.year == 2 && uc.semester == 2) {
                  return (
                  <div key={uc.calendar} className="flex flex-row items-center">
                    <CustomCheckbox style="w-[16px] h-[16px]" id={uc.calendar} array={actualFilter.UcsFilter} handle={handleUc} scope="uc"/>
                    <label className="text-md pl-2 mt-[2px]" htmlFor={uc.calendar}>{uc.name}</label>
                  </div>  
                )
                }
            })}
            </div>   

          </div>

          <div className={`p-[4px] pt-2 pb-2 transition-all duration-200 overflow-hidden px-3 w-11/12 flex flex-col items-center justify-start border-b ${isOpened.year == 3 ? isOpened.semester == 1 ? 'h-[250px]' : isOpened.semester == 2 ? 'h-[280px]' : 'h-[115px]' : 'h-[40px]'}`}>
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex justify-center items-center">
                <CustomCheckbox style="w-[18px] h-[18px]" id="3ano" array={actualFilter.UcsFilter} handle={handleYear} scope="year"/>
                <label onClick={() => handleYear('3ano')} className="text-md pl-2 mt-[2px]" htmlFor="3ano">3° ano</label>
              </div>
              <FiChevronDown onClick={() => handleOpenedYear(3)} className={`cursor-pointer transition duration-300 text-xl text-black ${isOpened.year == 3 ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
            </div>

            <div className="flex flex-row justify-between items-center w-full">
              <div className="w-full pl-1 mt-2 text-lg flex items-center">              
                <CustomCheckbox style="w-[16px] h-[16px]" id="3ano1semestre" array={actualFilter.UcsFilter} handle={handleSemester} scope="semester"/>
                <h1 className="pl-2"><strong>1° Semestre</strong></h1>
              </div>
            <FiChevronDown onClick={() => handleOpenedSemester(1)} className={`cursor-pointer transition duration-300 text-xl text-black ${isOpened.semester == 1 ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
            </div>

            <div className={`w-11/12 ${isOpened.semester == 1 ? 'block' : 'hidden'} mt-2`}>
              {UCsObj.map((uc) => {
                if (uc.year == 3 && uc.semester == 1) {
                  return (
                  <div key={uc.calendar} className="flex flex-row items-center">
                    <CustomCheckbox style="w-[16px] h-[16px]" id={uc.calendar} array={actualFilter.UcsFilter} handle={handleUc} scope="uc"/>
                    <label className="text-md pl-2 mt-[2px]" htmlFor={uc.calendar}>{uc.name}</label>
                  </div>  
                )
                }
            })}
            </div>            

            <div className="flex flex-row justify-between items-center w-full">
              <div className="w-full pl-1 mt-2 text-lg flex items-center">              
                <CustomCheckbox style="w-[16px] h-[16px]" id="3ano2semestre" array={actualFilter.UcsFilter} handle={handleSemester} scope="semester"/>
                <h1 className="pl-2"><strong>2° Semestre</strong></h1>
              </div>
            <FiChevronDown onClick={() => handleOpenedSemester(2)} className={`cursor-pointer transition duration-300 text-xl text-black ${isOpened.semester == 2 ? 'rotate-180' : 'rotate-0'}`}></FiChevronDown>
            </div>

            <div className={`w-11/12 ${isOpened.semester == 2 ? 'block' : 'hidden'} mt-2`}>
              {UCsObj.map((uc) => {
                if (uc.year == 3 && uc.semester == 2) {
                  return (
                  <div key={uc.calendar} className="flex flex-row items-center">
                    <CustomCheckbox style="w-[16px] h-[16px]" id={uc.calendar} array={actualFilter.UcsFilter} handle={handleUc} scope="uc"/>
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
            <CustomCheckbox style="w-[16px] h-[16px]" id="Evento" array={actualFilter.eventsFilter} handle={handleEvents} scope="uc"/>
            <label className="text-xl pl-2 mt-[2px]" htmlFor="eventos">Eventos</label>
          </div>

        </div>

    </div>
  )
}