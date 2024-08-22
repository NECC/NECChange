"use client";
import BasicDatePicker from "@/components/globals/BasicDatePicker";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/globals/Loader";
import UcsInput from "@/components/admin/datatable/UcsInput";
import moment from "moment";
import "moment/locale/pt";

import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function convertToRegularDate(date) {
  const day = date.date();
  const month = date.month();
  /*   const hour = date.hour();       + " às " + hour + ":" + minutes;
  const minutes = date.minutes(); */

  return day + "/" + month;
}

export default function ManageTrades() {
  const currencies = [
    {
      value: "USD",
      label: "$",
    },
    {
      value: "EUR",
      label: "€",
    },
    {
      value: "BTC",
      label: "฿",
    },
    {
      value: "JPY",
      label: "¥",
    },
  ];
  const [status, setStatus] = useState("Fechado");
  const [loader, setLoader] = useState(false);
  const [startDate, setStartDate] = useState(null);

  const buttonStyle = "w-full col-span-2 text-white font-bold";

  useEffect(() => {
    const get_status = async () => {
      await axios
        .get("/api/admin/trades_period/status")
        .then((res) => {
          if (res.data.status.isOpen) {
            const openDate = convertToRegularDate(
              moment(res.data.status.openDate)
            );
            const closingDate = convertToRegularDate(
              moment(res.data.status.closeDate)
            );
            setStatus(`Aberto de ${openDate} até ${closingDate}`);
          } else {
            setStatus("Fechado");
          }
          //console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    get_status();
  }, [loader]);

  const handleTrades = async () => {
    const date = startDate?.["$d"]; // Assumindo que $d é um objeto Date
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      setLoader(true);
      await axios
        .post("/api/calendar/getCalendar", {
          title: "PC - Exame (3º ano)",
          start: formattedDate,
        })
        .then((res) => {
          toast.success("Sucesso!");
        })
        .catch((err) => {
          toast.error("Erro!");
        });
      setLoader(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-white text-black w-screen h-screen">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="text-xl font-bold">Definir datas de eventos</div>
        <UcsInput />
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              id="outlined-select-currency"
              select
              label="Select"
              defaultValue="EUR"
              helperText="Please select your currency"
            >
              {currencies.map((option) => (
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
