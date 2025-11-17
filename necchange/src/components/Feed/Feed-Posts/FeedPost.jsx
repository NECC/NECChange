"use client";
import React, { useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import Badge from "../../globals/Badge";
import moment from "moment";
import "moment/locale/pt";

const statusMap = {
  ACCEPTED: ["Aceite", "green"],
  PENDING: ["Pendente", "yellow"],
  REMOVED: ["Removido", "red"],
  ERROR: ["Não é possível", "red"]
};

const type_class = {
  1: "T",
  2: "TP",
  3: "PL",
};

export default function FeedPost({ post, toggleLoader, isPersonalFeed = false, onTradeComplete }) {
  const { data: session } = useSession();
  const requester = post?.from_student;
  const accepter = post?.to_student;
  const trades = post?.trade_id || [];
  const isOwner = requester?.number === session?.user.number;
  const isAccepter = accepter?.number === session?.user.number;
  
  const [status, setStatus] = useState(statusMap[post.status]);
  const [clicked, setClicked] = useState(false);

  const groupedTrades = useMemo(() => {
    const grouped = {};
    
    trades.forEach((trade) => {
      const courseId = trade.lessonFrom?.course?.id;
      const courseName = trade.lessonFrom?.course?.name;
      const year = trade.lessonFrom?.course?.year;
      const type = trade.lessonFrom?.type;
      const fromShift = trade.lessonFrom?.shift;
      const toShift = trade.lessonTo?.shift;

      const key = `${courseId}-${type}-${fromShift}-${toShift}`;

      if (!grouped[key]) {
        grouped[key] = {
          course: { id: courseId, name: courseName, year },
          type,
          fromShift,
          toShift,
          trades: []
        };
      }
      
      grouped[key].trades.push(trade);
    });

    return Object.values(grouped);
  }, [trades]);

  const acceptTrade = async () => {
    toggleLoader(true);
    try {
      const res = await axios.post('/api/feed/feed_post/accept_trade', {
        params: {
          fromStudentNr: requester?.number,
          studentAcceptedNr: session?.user.number,
          tradeId: post?.id,
        },
      });
      if (res.data.response === true) {
        toast.success("Troca realizada com sucesso!");
        setStatus(statusMap.ACCEPTED);
        setClicked(true);
        
        // Refresh the feed after successful trade
        if (onTradeComplete) {
          setTimeout(() => {
            onTradeComplete();
          }, 1000); // Small delay to let the user see the success message
        }
      } else {
        toast.error("Não é possível realizar a troca!");
        setStatus(statusMap.ERROR);
        setClicked(true);
      }
    } finally {
      toggleLoader(false);
    }
  };

  const removeTrade = async () => {
    toggleLoader(true);
    try {
      await axios.put('/api/feed/feed_post/remove_trade', {
        params: { tradeId: post.id },
      });
      toast.success("Pedido de troca removido!");
      setStatus(statusMap.REMOVED);
      setClicked(true);
      
      // Refresh the feed after removing trade
      if (onTradeComplete) {
        setTimeout(() => {
          onTradeComplete();
        }, 1000);
      }
    } catch {
      toast.error("Erro ao remover o pedido de troca!");
    } finally {
      toggleLoader(false);
    }
  };

  const otherStudent = isOwner ? accepter : requester;
  const showOtherStudentNumber = isPersonalFeed && post.status === 'ACCEPTED';

  return (
    <div className="rounded-md text-base bg-white p-6 border shadow w-full grid gap-8">
      <div className="flex items-center justify-between gap-2">
        <p>
          Solicitado por{" "}
          <strong className="text-lg font-semibold">
            {requester?.name || requester?.number || "Aluno"}
          </strong>{" "}
          há {moment(post.publish_time).fromNow(true)} atrás
        </p>
        {(isOwner || isAccepter || clicked) && (
          <Badge variant={status[1]}>{status[0]}</Badge>
        )}
      </div>

      <div className="grid">
        {groupedTrades.map((groupedTrade, i) => {
          const { course, type, fromShift, toShift } = groupedTrade;
          const typeStr = type_class[type];
          const from = `${typeStr}${fromShift}`;
          const to = `${typeStr}${toShift}`;
          const year = course?.year;
          
          const colors = ["text-cyan-500", "text-teal-500", "text-violet-500"];
          const yearColor = colors[year - 1] || "text-gray-600";

          return (
            <div
              className="grid grid-cols-2 items-center py-1 w-full border-b last:border-none"
              key={i}
            >
              <p className="font-semibold">
                <span className={`mr-1 font-bold ${yearColor}`}>
                  ({year}º Ano)
                </span>
                {course?.name}
              </p>
              <div className="flex justify-end">
                <div className="ml-2 flex items-baseline gap-3">
                  <p>
                    {requester?.number}{" "}
                    <span className="font-semibold">{from}</span>
                  </p>
                  <FaArrowRightArrowLeft className="text-[11px] text-blue-900" />
                  <p>
                    <span className="font-semibold">{to}</span>{" "}
                    {showOtherStudentNumber ? otherStudent?.number : 
                     (!isOwner && post.status === 'PENDING') ? session?.user.number : "—"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!clicked && post.status === 'PENDING' && (
        <div className="flex justify-end">
          {isOwner ? (
            <button
              className="py-2 px-4 bg-red-600 hover:bg-red-500 font-bold text-white rounded-lg"
              onClick={removeTrade}
            >
              Remover Troca
            </button>
          ) : (
            <button
              className="py-2 px-4 bg-blue-500 hover:bg-blue-600 font-bold text-white rounded-lg"
              onClick={acceptTrade}
            >
              Aceitar Troca
            </button>
          )}
        </div>
      )}

      {isPersonalFeed && post.status === 'ACCEPTED' && (
        <div className="flex justify-end">
          <p className="text-sm text-green-600 font-semibold">
            ✓ Troca concluída com {otherStudent?.name || otherStudent?.number}
          </p>
        </div>
      )}
    </div>
  );
}