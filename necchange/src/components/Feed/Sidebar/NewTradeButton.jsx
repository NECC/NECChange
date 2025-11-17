import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa6";
import { toast } from "react-toastify";
import Modal from "@/components/globals/Modal";
import TradeEntry from "./NewTrade/popUp/TradeEntry";
import { useSession } from "next-auth/react";

const emptyTrade = {
  id: 0,
  ucId: 0,
  type: 0,
  fromShift: 0,
  toShift: 0,
};

const format_validator = (trades) => {
  // verificar se tudo está preenchido
  const entries_empty = trades.filter(
    (trade) => trade.fromShift == 0 || trade.toShift == 0 || trade.ucId == 0
  );
  
  // verificar se não há repetições
  let no_repetitions = true;
  trades.forEach((trade) => {
    const repeated_entry = trades.filter(
      (trade_aux) =>
        trade_aux.fromShift == trade.fromShift && trade_aux.ucId == trade.ucId
    );
    if (repeated_entry.length > 1) {
      no_repetitions = false;
      return false;
    }
  });
  
  if (entries_empty.length == 0 && no_repetitions) return true;
  else return false;
};

export default function NewTrade({ toggleLoader }) {
  const [showModal, setShowModal] = useState(false);
  const [trades, setTrades] = useState([emptyTrade]);
  const [enrolledClasses, setEnrolledClasses] = useState({});
  const [availableClasses, setAvailableClasses] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const fetchClasses = async () => {
    if (!session?.user?.number) {
      toast.error("Sessão inválida!");
      return;
    }

    setIsLoading(true);

    try {
      // Fetch enrolled classes
      const enrolledResponse = await axios.get(
        `/api/users/user_courses/${session.user.number}`
      );
      
      const data = enrolledResponse.data.student_ucs;
      //console.log("Raw student data:", data);
      
      const parsed = data.reduce((acc, { lesson }) => {
        if (!acc[lesson.course.name]) {
          acc[lesson.course.name] = {
            ucId: lesson.course.id,
            classes: [],
          };
        }
        
        const result = acc[lesson.course.name].classes.filter(
          (lesson_aux) =>
            lesson_aux.shift == lesson.shift && lesson_aux.type == lesson.type
        );
        
        if (result.length == 0) {
          acc[lesson.course.name].classes.push({
            classId: lesson.id,
            shift: lesson.shift,
            type: lesson.type,
          });
        }
        
        return acc;
      }, {});
      
      setEnrolledClasses(parsed);
      //console.log("Parsed enrolled classes:", parsed);
      
      // Fetch available classes
      const ucs = Object.values(parsed).map(({ ucId }) => ucId);
      
      const availableResponse = await axios.get(
        `/api/users/user_shifts?${ucs
          .map((n, index) => `ucs[${index}]=${n}`)
          .join("&")}`
      );
      
      const res = availableResponse.data.classes;
      console.log("Available classes response:", res);
      
      // Parse available classes and EXCLUDE enrolled ones
      const parsedAvailable = res.reduce((acc, courseData) => {
        const { name, id, class: classArray } = courseData;
        
        // Validação: Verificar se class existe e é um array
        if (!classArray || !Array.isArray(classArray)) {
          console.warn(`UC "${name}" has no classes available:`, courseData);
          acc[name] = {
            ucId: id,
            classes: [],
          };
          return acc;
        }
        
        // Get the enrolled classes for this course
        const enrolledForThisCourse = parsed[name]?.classes || [];
        
        // Filter out classes that the student is already enrolled in
        const availableOnly = classArray
          .map(({ id, shift, type }) => ({
            classId: id,
            shift,
            type,
          }))
          .filter((availableClass) => {
            // Check if this class is NOT in the enrolled list
            return !enrolledForThisCourse.some(
              (enrolledClass) =>
                enrolledClass.shift === availableClass.shift &&
                enrolledClass.type === availableClass.type
            );
          });
        
        acc[name] = {
          ucId: id,
          classes: availableOnly,
        };
        
        return acc;
      }, {});
      
      // Garantir que todas as UCs inscritas existem em availableClasses
      Object.keys(parsed).forEach((ucName) => {
        if (!parsedAvailable[ucName]) {
          console.warn(`UC "${ucName}" not found in available classes, adding empty entry`);
          parsedAvailable[ucName] = {
            ucId: parsed[ucName].ucId,
            classes: [],
          };
        }
      });
      
      setAvailableClasses(parsedAvailable);
      //console.log("Parsed available classes (excluding enrolled):", parsedAvailable);
      setIsLoading(false);
      
    } catch (err) {
      console.error("Error fetching classes:", err);
      console.error("Error details:", err.response?.data);
      toast.error("Erro ao carregar turmas!");
      setIsLoading(false);
      setShowModal(false);
    }
  };

  const handleOpenModal = async () => {
    setShowModal(true);
    
    // Only fetch if we don't have the data yet
    if (Object.keys(enrolledClasses).length === 0) {
      await fetchClasses();
    }
  };

  const addTrade = () => {
    const id = trades.length == 0 ? 0 : trades[trades.length - 1].id + 1;
    setTrades([
      ...trades,
      {
        ...emptyTrade,
        id: id,
      },
    ]);
  };

  const removeTrade = (id) => {
    const newTrades = trades.filter((trade) => trade.id != id);
    setTrades(newTrades);
  };

  const updateTrade = (id, tradeData) => {
    const newTrades = trades.map((trade) => {
      if (trade.id == id) {
        trade = { ...trade, ...tradeData };
      }
      return trade;
    });
    setTrades(newTrades);
  };

  useEffect(() => {
   /* 
    console.log("Trades", trades);
    console.log("Enrolled Classes", enrolledClasses);
    console.log("Available Classes", availableClasses);
    */
  }, [trades, enrolledClasses, availableClasses]);

  const submitTrades = () => {
    // Add this check first
    if (!session?.user?.number) {
      toast.error("Sessão inválida! Por favor, faz login novamente.");
      toggleLoader(false);
      return;
    }
  
    toggleLoader(true);
    
    if (format_validator(trades) == true) {
      axios
        .post("/api/feed/feed_post/add_trade", {
          trades: trades,  // Remove the params wrapper
          student_nr: session.user.number
        })
        .then((response) => {
          //console.log(response);
          toggleLoader(false);
          setShowModal(false);
          setTrades([emptyTrade]);
          toast.success("Pedido de troca realizado!");
        })
        .catch((err) => {
          console.error("Error submitting trade:", err);
          console.error("Error details:", err.response?.data); 
          toggleLoader(false);
          toast.error("Erro ao realizar o pedido de troca!");
        });
    } else {
      toggleLoader(false);
      toast.warning("Formato de troca inválido!");
    }
  };

  return (
    <>
      <button
        className="w-full sm:w-auto py-1 px-3 rounded-md text-blue-600 font-semibold border hover:bg-gray-100"
        onClick={handleOpenModal}
      >
        Nova Troca
      </button>
      
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        title="Nova troca"
      >
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">A carregar turmas...</p>
            </div>
          </div>
        ) : Object.keys(enrolledClasses).length === 0 ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <p className="text-gray-500">Não tens turmas inscritas.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col space-y-2 mb-3 min-h-[50vh]">
              {trades.map((trade) => (
                <TradeEntry
                  key={trade.id}
                  removeTrade={() => removeTrade(trade.id)}
                  updateTrade={(tradeData) => updateTrade(trade.id, tradeData)}
                  enrolledClasses={enrolledClasses}
                  availableClasses={availableClasses}
                />
              ))}
              
              <button
                className="flex justify-center items-center mx-auto p-2 w-full rounded-2xl bg-slate-100 hover:bg-slate-200 text-blue-500 font-semibold"
                onClick={addTrade}
              >
                <FaPlus className="text-2xl mr-2" />
                Adicionar Troca
              </button>
            </div>
            
            <button
              className="flex justify-center w-full py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold"
              onClick={submitTrades}
            >
              Submeter trocas
            </button>
          </>
        )}
      </Modal>
    </>
  );
}