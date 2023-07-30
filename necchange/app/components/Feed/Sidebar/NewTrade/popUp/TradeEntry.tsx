"use client";
import React, { useEffect, useState } from "react";
import { FaArrowRightArrowLeft, FaMinus } from "react-icons/fa6";
import Select from "@/app/components/globals/Select";

const classMap: any = {
  1: "T",
  2: "TP",
  3: "PL",
};

interface TradeEntryI {
  updateTrade: any;
  enrolledClasses: any;
  availableClasses: any;
}

export default function TradeEntry(props: TradeEntryI) {
  const { updateTrade, enrolledClasses, availableClasses } = props;
  // selection controls
  const [ucSelection, setUcSelection] = useState("");
  const [fromSelection, setFromSelection] = useState("");
  const [toSelection, setToSelection] = useState("");
  // selection options
  const [from, setFrom] = useState([]);
  const [to, setTo] = useState([]);

  useEffect(() => {
    if (Object.keys(enrolledClasses).length === 0) return;
    const name = Object.keys(enrolledClasses)[Number(ucSelection)];
    const enrolled = enrolledClasses[name].classes.map(
      ({ type, shift }: any, index: number) => [
        index,
        `${classMap[type]}${shift}`,
      ]
    );

    updateTrade({
      ucId: enrolledClasses[name].ucId,
    });

    setFrom(enrolled);
  }, [ucSelection]);

  useEffect(() => {
    if (Object.keys(enrolledClasses).length === 0) return;
    const name = Object.keys(enrolledClasses)[Number(ucSelection)];
    const from = enrolledClasses[name].classes[Number(fromSelection)];

    const available = availableClasses[name].classes
      .filter(
        ({ type, shift }: any) => type === from.type && shift !== from.shift
      )
      .map(({ type, shift }: any, index: number) => [
        index,
        `${classMap[type]}${shift}`,
      ]);

    updateTrade({
      type: from.type,
      fromShift: from.shift,
    });

    console.log("from", from, available);
    setTo(available);
  }, [fromSelection]);

  useEffect(() => {
    if (Object.keys(availableClasses).length === 0) return;
    const name = Object.keys(enrolledClasses)[Number(ucSelection)];
    const to = availableClasses[name].classes[Number(toSelection)];
    console.log("to", name, to);
    updateTrade({
      toShift: to.shift,
    });
  }, [toSelection]);

  return (
    <div className="text-center bg-slate-100 p-6 rounded-2xl w-full">
      <div className="text-white grid grid-cols-12 gap-4 items-center">
        <div className="col-span-6">
          <Select
            options={Object.keys(enrolledClasses).map((name: string, index) => [
              index,
              name,
            ])}
            setter={setUcSelection}
            selected={"-1"}
            placeholder="Selecione a UC"
          />
        </div>

        <FaMinus className="text-2xl text-blue-500 w-12" />

        <div className="col-span-2">
          <Select
            options={from}
            setter={setFromSelection}
            selected={"-1"}
            placeholder="TP*"
          />
        </div>

        <FaArrowRightArrowLeft className="text-2xl text-blue-500 w-12" />

        <div className="col-span-2">
          <Select
            options={to}
            setter={setToSelection}
            selected={"-1"}
            placeholder="TP*"
          />
        </div>
      </div>
    </div>
  );
}
