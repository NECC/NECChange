"use client";
import BasicDateTimePicker from "@/components/globals/BasicDateTimePicker";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/globals/Loader";
import moment from "moment";
import "moment/locale/pt";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function convertToRegularDate(date) {
  if (!date || !moment(date).isValid()) {
    return "Data inválida";
  }
  const momentDate = moment(date);
  const day = momentDate.date();
  const month = momentDate.month() + 1;
  const hour = momentDate.hour();
  const minutes = momentDate.minutes().toString().padStart(2, '0');
  return `${day}/${month} às ${hour}:${minutes}`;
}

export default function ManageTrades() {
  const [status, setStatus] = useState("Carregando...");
  const [isOpen, setIsOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [closeDate, setCloseDate] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  
  const buttonStyle = "w-full col-span-2 text-white font-bold";

  useEffect(() => {
    const get_status = async () => {
      try {
        console.log("Fetching status...");
        const res = await axios.get("/api/admin/trades_period/status");
        console.log("Status response:", res.data);
        
        // Since backend uses .maybeSingle(), this is an object, not an array
        const periodData = res.data.status;
        
        // Check if we have period data
        if (!periodData || typeof periodData !== 'object') {
          console.log("No period data found");
          setStatus("Nenhum período configurado");
          setIsOpen(false);
          return;
        }
        
        console.log("Period data object:", periodData);
        
        // Now we can safely access the properties
        const isOpenValue = periodData.isOpen ?? false;
        
        if (isOpenValue === true) {
          const rawOpenDate = periodData.openDate;
          const rawCloseDate = periodData.closeDate;
          
          if (rawOpenDate && rawCloseDate) {
            const openDate = convertToRegularDate(rawOpenDate);
            const closingDate = convertToRegularDate(rawCloseDate);
            setStatus(`Aberto de ${openDate} até ${closingDate}`); // Fixed: added opening parenthesis
            setIsOpen(true);
            console.log("Status set to OPEN");
          } else {
            setStatus("Aberto (datas indisponíveis)");
            setIsOpen(true);
            console.warn("Period is open but dates are missing");
          }
        } else {
          setStatus("Fechado");
          setIsOpen(false);
          console.log("Status set to CLOSED");
        }
      } catch (err) {
        console.error("Error fetching status:", err);
        setStatus("Erro ao carregar");
        toast.error("Erro ao carregar status");
      }
    };
    
    get_status();
  }, [refreshTrigger]);
  
  const handleTrades = async (action) => {
    // Validate dates only when opening period
    if (!action && (!startDate || !closeDate)) {
      toast.error("Por favor, selecione as datas de início e fim");
      return;
    }

    // Validate date order when opening
    if (!action && startDate && closeDate) {
      const start = moment(startDate["$d"]);
      const end = moment(closeDate["$d"]);
      
      if (end.isSameOrBefore(start)) {
        toast.error("A data de fim deve ser posterior à data de início");
        return;
      }
    }

    setLoader(true);
    try {
      console.log("Sending request:", {
        close: action,
        openDate: startDate?.["$d"],
        closeDate: closeDate?.["$d"],
      });

      const res = await axios.put("/api/admin/trades_period/change_date", {
        close: action,
        openDate: startDate?.["$d"],
        closeDate: closeDate?.["$d"],
      });
      
      console.log("Response:", res.data);
      
      toast.success(action ? "Período fechado!" : "Período aberto!");
      
      // Refresh status immediately after successful update
      setRefreshTrigger(prev => prev + 1);
      
      // Clear date inputs after opening period
      if (!action) {
        setStartDate(null);
        setCloseDate(null);
      }
      
    } catch (err) {
      toast.error("Erro ao atualizar período de trocas");
      console.error("Error:", err);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-white text-black w-screen h-screen">
      <div className="grid grid-cols-2 gap-4 place-items-center max-w-2xl">
        <div className="col-span-2 text-xl">
          Estado: <span className={isOpen ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{status}</span>
        </div>

        {!isOpen && (
          <>
            <div className="col-span-2 text-xl font-bold">
              Definir datas para trocas
            </div>
            <div>
              <BasicDateTimePicker
                label={"Hora de começo"}
                value={startDate}
                setValue={setStartDate}
              />
            </div>
            <div>
              <BasicDateTimePicker
                label={"Hora de fecho"}
                value={closeDate}
                setValue={setCloseDate}
              />
            </div>
            <div className={buttonStyle}>
              <button
                className="border w-full p-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => handleTrades(false)}
                disabled={loader}
              >
                {loader ? "A processar..." : "Abrir período de trocas"}
              </button>
            </div>
          </>
        )}

        {isOpen && (
          <>
            <div className="col-span-2 text-lg text-gray-600 text-center">
              O período de trocas está ativo. Pode fechá-lo a qualquer momento.
            </div>
            <div className={buttonStyle}>
              <button
                className="border w-full p-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => handleTrades(true)}
                disabled={loader}
              >
                {loader ? "A processar..." : "Fechar período de trocas"}
              </button>
            </div>
          </>
        )}
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