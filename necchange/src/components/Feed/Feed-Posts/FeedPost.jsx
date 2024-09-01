import React, { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import Badge from "../../globals/Badge";
// há x tempo atrás
import moment from "moment";
import "moment/locale/pt";

const statusMap = {
  ACCEPTED: ["Aceite", "green"],
  PENDING: ["Pendente", "yellow"],
  REMOVED: ["Removido", "red"],
  ERROR: ["Não é possível", "red"],
};

const type_class = {
  1: "T",
  2: "TP",
  3: "PL",
};

export default function FeedPost({ post, toggleLoader }) {
  const { data: session } = useSession();
  const isWatchingOwnPost = session.user.number === post.from_student.number; 
  const fromStudentNr = post.from_student.number;
  const tradeId = post.id;

  /* variable status is an array */
  const [status, setStatus] = useState(statusMap[post.status]);
  const [clicked, setClicked] = useState(false);

  const acceptTrade = () => {
    toggleLoader(true);
    axios
      .post(`/api/feed/feed_post/accept_trade`, {
        params: {
          fromStudentNr: fromStudentNr,
          studentAcceptedNr: session?.user.number,
          tradeId: tradeId,
        },
      })
      .then((res) => {
        if (res.data.response == true) {
          toast.success("Troca realizada com sucesso!");
          post.status = "ACCEPTED";
          setStatus(statusMap["ACCEPTED"]);
        } else {
          toast.error("Não é possível realizar a troca! Turnos incompatíveis.");
          post.status = "ERROR";
          setStatus(statusMap["ERROR"]);
        }
        setClicked(!clicked);
        toggleLoader(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeTrade = () => {
    toggleLoader(true);
    axios
      .put(`/api/feed/feed_post/remove_trade`, {
        params: { tradeId: tradeId },
      })
      .then((res) => {
        toggleLoader(false);
        toast.success("Pedido de troca removido!");
        post.status = "ACCEPTED";
        setStatus(statusMap["ACCEPTED"]);
      })
      .catch((err) => {
        toggleLoader(false);
        toast.error("Erro ao remover o pedido de troca!");
        console.log(err);
      });

    setClicked(!clicked);
  };
  return (
    <div className="rounded-[20px] text-base bg-white border shadow flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-2 p-6">
        <p className="text-lg font-semibold">{fromStudentNr}</p> há{" "}
        {moment(post.publish_time).fromNow(true)} atrás
        {/*  { (isWatchingOwnPost || clicked) && <Badge variant={status[1]}>{status[0]}</Badge>} */}
      </div>

      <div className="grid p-6">
        {post.trade_id.map((lesson_trade, i) => {
          const { year, name } = lesson_trade.lessonFrom.course;
          const type = type_class[lesson_trade.lessonFrom.type];
          const from = `${type}${lesson_trade.lessonFrom.shift}`;
          const to = `${type}${lesson_trade.lessonTo.shift}`;
          const yearColor = [
            "text-cyan-500",
            "text-teal-500",
            "text-violet-500",
          ];
          const color = yearColor[year - 1];

          return (
            <div
              className="grid grid-cols-2 py-1"
              key={i}
            >
              <p className="font-semibold">
                <span className={`mr-1 font-bold ${color}`}>({year}º Ano)</span>{" "}
                {name}
              </p>
              <div className="flex justify-end">
                <div className="ml-2 flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center">
                    <p className="font-semibold">{from}</p>
                    <p>{fromStudentNr} </p>
                  </div>

                  <FaArrowRightArrowLeft className="text-[11px] text-blue-900" />

                  <div className="flex flex-col items-center justify-center">
                    <p className="font-semibold">{to}</p>
                    <p>{isWatchingOwnPost ? "Axxxxx" : session?.user.number}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`${clicked ? "hidden" : ""} h-full flex items-end `}>
        {isWatchingOwnPost ? (
          status[0] == "Pendente" && (
            <button
              className={`py-2 w-full h-auto bg-red-100 hover:bg-red-200 font-bold text-red-700 `}
              onClick={removeTrade}
            >
              Remover Troca
            </button>
          )
        ) : (
          <button
            className={`py-2 w-full bg-indigo-100 hover:bg-indigo-200 font-bold text-indigo-700`}
            onClick={acceptTrade}
          >
            Trocar
          </button>
        )}
      </div>
    </div>
  );
}
