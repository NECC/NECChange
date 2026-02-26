"use client";
import * as React from "react";
import BasicDatePicker from "@/components/globals/BasicDatePicker";
import TableDates from "@/components/admin/datatable/tableDates";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "@/components/globals/Loader";
import UcsInput from "@/components/admin/datatable/UcsInput";
//import YearInput from "@/components/admin/datatable/YearsInput";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { conforms } from "lodash";
import BasicDateTimePicker from "@/components/globals/BasicDateTimePicker";



export default function ManageTrades() {
  const types = [
    {
      value: "teste",
      label: "Teste",
    },
    {
      value: "entrega",
      label: "Entrega",
    },
    {
      value: "exame",
      label: "Exame",
    },
    {
      value: "miniteste",
      label: "Mini-Teste",
    },
    {
      value: "miniteste_pi",
      label: "Mini-Teste a decorrer nas aulas TP na semana",
    },
  ];

  const YearInput = [
    {
      value: "1º ano",
      label: "1º ano",
    },
    {
      value: "2º ano",
      label: "2º ano",
    },
    {
      value: "3º ano",
      label: "3º ano",
    },
  ];
  const buttonStyle = "w-full col-span-2 text-white font-bold";

  const [loader, setLoader] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [uc, setUC] = useState(null);
  const [type, setType] = useState(null);
  const [events, setEvents] = useState([]);
  const [ano,setAno] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const handleTrades = async () => {
    const date = startDate?.["$d"];
    //console.log("DATA :",startDate);
    
    if (!uc || !type || !date || !ano) {
      toast.error("Por favor, preencha todos os campos!");
      return;
    }
 
    let dia = date.getDate().toString().padStart(2, "0");
    let mes = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear().toString();
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    let seconds = date.getSeconds().toString();
  

    const formattedDate = `${year}-${mes}-${dia}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
  
    const eventData = {
      uc: uc.sigla,
      ano: ano,
      day: formattedDate,
      type: type,
      start: formattedTime,
      end: formattedTime,
    };
    //toast.info(eventData)
  
    setLoader(true);
    try {
      const res = await axios.post("/api/calendar/getCalendar", eventData);
      toast.success(`Evento criado para ${uc.sigla} (${ano})`);
      
      // Add to events state - need to handle grouped structure
      const newEvent = res.data.response;
      setEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };
        if (!updatedEvents[ano]) {
          updatedEvents[ano] = [];
        }
        updatedEvents[ano].push(newEvent);
        return updatedEvents;
      });
      
      // setUC(null);
      // setType(null);
      // setStartDate(null);
      // setAno(null);
      // setFormKey(prev => prev + 1); 
    } catch (err) {
      toast.error("Erro ao criar evento!");
      console.log("Erro ->", err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    axios
      .get("/api/calendar/getCalendar")
      .then((res) => {
        setEvents(res.data.response);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="flex justify-between  items-center bg-white text-black w-screen h-screen p-14">
      <div className="w-1/2 overflow-hidden h-1/2 bg-gray-400 dark:bg-gray-700 overflow-y-auto shadow-md sm:rounded-lg">
        <TableDates events={events} setEvents={setEvents} />
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="text-xl font-bold">Definir Datas de Eventos</div>
      
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: 300 },
          }}
          noValidate
          autoComplete="off"
        >
            <div>
              <TextField
                select
                label="Ano UC"
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  const selectedOption = YearInput.find(
                    (option) => option.value === selectedValue
                  );
                  setAno(selectedOption.label);
                }}
              >
                {YearInput.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <UcsInput setValue={setUC} ano={ano} />

          <div>
            <TextField
              select
              label="Tipo de evento"
              
              onChange={(event) => {
                const selectedValue = event.target.value;
                const selectedOption = types.find(
                  (option) => option.value === selectedValue
                );
                setType(selectedOption.label);
              }}
            >
              {types.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
        
        <div>
          <BasicDateTimePicker
            label={"Data e Hora"}
            value={startDate}
            setValue={setStartDate}
          />
        </div>
        </Box>
        {/* <div>
          <BasicDateTimePicker
            label={"Fim do Evento"}
            value={endDate}
            setValue={setEndDate}
          />
        </div> */}
        <div className={buttonStyle}>
          <button
            className="border w-full p-2 rounded-lg bg-blue-500 hover:bg-blue-600"
            onClick={() => {
              handleTrades(false);
            }}
          >
            Submeter
          </button>
        </div>
      </div>
      {loader && <Loader />}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}