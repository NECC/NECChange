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
import { conforms } from "lodash";

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
  ];
  const buttonStyle = "w-full col-span-2 text-white font-bold";

  const [loader, setLoader] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [uc, setUC] = useState(null);
  const [type, setType] = useState(null);
  const [events, setEvents] = useState([]);

  const handleTrades = async () => {
    const date = startDate?.["$d"];
    if (date) {
      let dia = date.getDate().toString();
      let mes = date.getMonth() + 1; 
      let mescomzero = mes < 10 ? "0" + mes : mes.toString();
      let ano = date.getFullYear().toString();
      
      dia = dia.length < 2 ? "0" + dia : dia;
      
      const formattedDate = ano + "-" + mescomzero + "-" + dia;
      console.log(formattedDate);
      setLoader(true);
      await axios
        .post("/api/calendar/getCalendar", {
          title: `${uc.sigla} - ${type} (${uc.year}º ano)`,
          start: formattedDate,
        })
        .then((res) => {
          toast.success("Sucesso!");
          setEvents([...events, res.data.response]);
        })
        .catch((err) => {
          toast.error("Erro!");
        });
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
        <UcsInput setValue={setUC} />
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
        </Box>
        <div>
          <BasicDatePicker
            label={"Data do Evento"}
            value={startDate}
            setValue={setStartDate}
          />
        </div>
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