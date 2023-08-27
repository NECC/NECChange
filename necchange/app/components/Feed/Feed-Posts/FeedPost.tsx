import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import Badge from "../../globals/Badge";
// há x tempo atrás
import moment from "moment";
import "moment/locale/pt";

interface statusMapProps {
  [key: string]: [string, "green" | "yellow" | "red"];
}
const statusMap: statusMapProps = {
  ACCEPTED: ["Aceite", "green"],
  PENDING: ["Pendente", "yellow"],
  REMOVED: ["Removido", "red"],
};

const type_class: any = {
  1: "T",
  2: "TP",
  3: "PL",
};

interface FeedPostProps {
  post: {
    id: number;
    from_student: {
      number: string;
    };
    publish_time: string;
    status: "ACCEPTED" | "PENDING" | "REMOVED";
    trade_id: any[];
  };
  toggleLoader: Function;
}

export default function FeedPost({ post, toggleLoader }: FeedPostProps) {
  const { data: session } = useSession();
  const isViewingOwnPost = session?.user.number === post.from_student.number;
  const fromStudentNr = post.from_student.number;
  const tradeId = post.id;
  const [status, badgeVariant] = statusMap[post.status];

  const acceptTrade = () => {
    toggleLoader(true);
    axios
      .post(`api/feed/feed_post/accept_trade`, {
        params: { fromStudentNr: fromStudentNr, studentAcceptedNr: session?.user.number, tradeId: tradeId },
      })
      .then((res) => {
        if (res.data.response == true) {
          toast.success("Troca realizada com sucesso!");
        } else {
          toast.error("Não é possível realizar a troca!");
        }
        toggleLoader(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeTrade = () => {
    toggleLoader(true);
    axios
      .put(`api/feed/feed_post/remove_trade`, {
        params: { tradeId: tradeId },
      })
      .then((res) => {
        toggleLoader(false);
        toast.success("Pedido de troca removido!");
      })
      .catch((err) => {
        toggleLoader(false);
        toast.error("Erro ao remover o pedido de troca!");
        console.log(err);
      });
  };

  return (
    <div className="rounded-md text-base bg-white p-6 border shadow w-full grid gap-8">
      <div className="flex items-center justify-between gap-2">
        <p className="">
          Solicitado por{" "}
          <strong className="text-lg font-semibold">{fromStudentNr}</strong> há{" "}
          {moment(post.publish_time).fromNow(true)} atrás
        </p>

        {isViewingOwnPost && <Badge variant={badgeVariant}>{status}</Badge>}
      </div>

      <div className="grid">
        {post.trade_id.map((lesson_trade: any, i: number) => {
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
              className="grid grid-cols-2 items-center py-1 w-full border-b last:border-none"
              key={i}
            >
              <p className="font-semibold">
                <span className={`mr-1 font-bold ${color}`}>({year}º Ano)</span>{" "}
                {name}
              </p>
              <div className="flex justify-end">
                <div className="ml-2 flex items-baseline gap-3">
                  <p className="">
                    {fromStudentNr}{" "}
                    <span className="font-semibold">{from}</span>
                  </p>
                  <FaArrowRightArrowLeft className="text-[11px] text-blue-900" />
                  <p className="">
                    <span className="font-semibold">{to}</span>{" "}
                    {isViewingOwnPost ? "Axxxxx" : session?.user.number}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        {isViewingOwnPost ? (
          status == "Pendente" && (
            <button
              className={`py-2 px-4 bg-red-600 hover:bg-red-500 font-bold text-white rounded-lg`}
              onClick={removeTrade}
            >
              Remover Troca
            </button>
          )
        ) : (
          <button
            className={`py-2 px-4 bg-blue-500 hover:bg-blue-600 font-bold text-white rounded-lg`}
            onClick={acceptTrade}
          >
            Trocar
          </button>
        )}
      </div>
    </div>
  );
}
