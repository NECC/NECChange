"use client";
import * as React from "react";
import BasicDatePicker from "@/components/globals/BasicDatePicker";
import TableDates from "@/components/admin/datatable/tableDates";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "@/components/globals/Loader";
import UcsInput from "@/components/admin/datatable/UcsInput";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BasicDateTimePicker from "@/components/globals/BasicDateTimePicker";

export default function ManageTrades() {
  const types = [
    { value: "teste", label: "Teste" },
    { value: "entrega", label: "Entrega" },
    { value: "exame", label: "Exame" },
    { value: "miniteste", label: "Mini-Teste" },
    { value: "miniteste_pi", label: "Mini-Teste a decorrer nas aulas TP na semana" },
  ];

  //'WORKSHOP','TALK','TERTULIA','OTHER']
  const EventTypes = [
    { value: "WORKSHOP", label: "WORKSHOP" },
    { value: "TALK", label: "TALK" },
    { value: "TERTULIA", label: "TERTULIA" },
    { value: "OTHER", label: "OTHER" },

  ];

  const YearInput = [
    { value: "1º ano", label: "1º ano" },
    { value: "2º ano", label: "2º ano" },
    { value: "3º ano", label: "3º ano" },
    { value: "0º ano", label: "Evento" },
  ];
  const buttonStyle = "w-full col-span-2 text-white font-bold";

  const [loader, setLoader] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [uc, setUC] = useState(null);
  const [type, setType] = useState("");
  const [events, setEvents] = useState([]);
  const [ano, setAno] = useState("");

  const handleTrades = async () => {
    const date = startDate?.["$d"];
    
    if (!uc || !type || !date || !ano) {
      toast.error("Por favor, preencha todos os campos!");
      return;
    }
 
    let dia = date.getDate().toString().padStart(2, "0");
    let mes = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear().toString();
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let seconds = date.getSeconds().toString().padStart(2, "0");

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
  
    setLoader(true);
    try {
      const res = await axios.post("/api/calendar/getCalendar", eventData);
      toast.success(`Evento criado para ${uc.sigla} (${ano})`);
      
      const newEvent = res.data.response;
      setEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };
        if (!updatedEvents[ano]) {
          updatedEvents[ano] = [];
        }
        updatedEvents[ano].push(newEvent);
        return updatedEvents;
      });
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
 
  const activeOptions = ano === "0º ano" ? EventTypes : types;

  return (
    <div className="flex justify-between items-center bg-white text-black w-screen h-screen p-14">
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
              value={ano ?? ""}
              onChange={(event) => setAno(event.target.value)}
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
              value={type ?? ""}
              onChange={(event) => setType(event.target.value)}
            >
              {activeOptions.map((option) => (
                <MenuItem key={option.value} value={option.label}>
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
        <div className={buttonStyle}>
          <button
            className="border w-full p-2 rounded-lg bg-blue-500 hover:bg-blue-600"
            onClick={() => handleTrades(false)}
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