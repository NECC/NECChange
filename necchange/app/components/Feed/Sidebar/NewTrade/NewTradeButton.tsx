import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa6";
import Modal from "@/app/components/globals/Modal";
import TradeEntry from "./popUp/TradeEntry";

const emptyTrade = {
  id: 0,
  ucId: 0,
  type: 0,
  fromShift: 0,
  toShift: 0,
};

interface FilterProps {
  student_nr: string;
}

export default function NewTrade(props: FilterProps) {

  const [showModal, setShowModal] = useState(false);
  const [trades, setTrades] = useState([emptyTrade]);
  const [enrolledClasses, setEnrolledClasses] = useState({});
  const [availableClasses, setAvailableClasses] = useState({});

  const { student_nr } = props;  

  useEffect(() => {
    axios
      .get(`api/trades/student_ucs/${student_nr}`)
      .then((response) => {
        const data = response.data.student_ucs;
        const parsed = data.reduce((acc: any, { lesson }: any) => {
          if (!acc[lesson.course.name]) {
            acc[lesson.course.name] = {
              ucId: lesson.course.id,
              classes: [],
            };
          }
          acc[lesson.course.name].classes.push({
            classId: lesson.id,
            shift: lesson.shift,
            type: lesson.type,
          });
          return acc;
        }, {});
        setEnrolledClasses(parsed);

        const ucs = Object.values(parsed).map(({ ucId }: any) => ucId);
        return axios.get(
          `api/trades/shifts?${ucs
            .map((n, index) => `ucs[${index}]=${n}`)
            .join("&")}`
        );
      })
      .then((response) => {
        const res = response.data.classes;
        const parsed = res.reduce((acc: any, { name, id, lesson }: any) => {
          acc[name] = {
            ucId: id,
            classes: lesson.map(({ id, shift, type }: any) => ({
              classId: id,
              shift,
              type,
            })),
          };
          return acc;
        }, {});

        setAvailableClasses(parsed);
      });
  }, []);

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

  const removeTrade = (id: number) => {
    console.log("Removing trade", id);
    const newTrades = trades.filter((trade) => trade.id != id);
    setTrades(newTrades);
  };

  const updateTrade = (id: number, tradeData: any) => {
    const newTrades = trades.map((trade) => {
      if (trade.id == id) {
        trade = { ...trade, ...tradeData };
      }
      return trade;
    });
    setTrades(newTrades);
  };

  useEffect(() => {
    console.log("Trades", trades);
  }, [trades]);

  const submitTrades = () => {
    axios
      .post("api/feed/feed_post/add_trade", {
        params: { trades: trades, student_nr: student_nr },
      })
      .then((response) => console.log(response));
  };




  return (
    <>
      <button
        className="flex justify-center w-full p-1 rounded-md bg-[#018ccb] hover:bg-[#007cb6] text-white font-semibold"
        onClick={() => setShowModal(true)}
      >
        Solicitar troca
      </button>

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        title="Solicitar troca"
      >
        <div className="flex flex-col space-y-2 mb-3 min-h-[50vh]">
          {trades.map((trade) => (
            <TradeEntry
              key={trade.id}
              removeTrade={() => removeTrade(trade.id)}
              updateTrade={(tradeData: any) => updateTrade(trade.id, tradeData)}
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
      </Modal>
    </>
  );
}
