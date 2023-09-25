"use client";
import React, { useEffect, useState } from "react";
import { FaArrowRightArrowLeft, FaMinus, FaTrashCan } from "react-icons/fa6";
import Select from "@/components/globals/Select";

const classMap = {
  1: "T",
  2: "TP",
  3: "PL",
};

export default function TradeEntry(props) {
  const { removeTrade, updateTrade, enrolledClasses, availableClasses } = props;
  // selection controls
  const [ucSelection, setUcSelection] = useState("");
  // selection options
  const [fromOptions, setFromOptions] = useState({
    options: [],
    key: 0,
  });
  const [toOptions, setToOptions] = useState({
    options: [],
    key: 0,
  });

  const classToText = ({ type, shift }) => `${classMap[type]}${shift}`;

  const handleUcSelection = (selected) => {
    console.log("Uc selected", selected);
    setUcSelection(selected);
    updateTrade({
      ucId: enrolledClasses[selected].ucId,
      type: 0,
      fromShift: 0,
      toShift: 0,
    });
    setFromOptions({
      options: enrolledClasses[selected].classes,
      key: fromOptions.key + 1,
    });
    setToOptions({
      options: [],
      key: toOptions.key + 1,
    });
  };

  const handleFromSelection = (selected) => {
    console.log("From selected", selected);
    updateTrade({
      type: selected.type,
      fromShift: selected.shift,
      toShift: 0,
    });

    const available = availableClasses[ucSelection].classes.filter(
      ({ type, shift }) => type === selected.type && shift !== selected.shift
    );
    setToOptions({
      options: available,
      key: toOptions.key + 1,
    });
  };

  const handleToSelection = (selected) => {
    console.log("To selected", selected);
    updateTrade({ toShift: selected.shift });
  };

  return (
    <div className="group text-center bg-slate-100 p-6 rounded-2xl w-full">
      <div className="flex items-center">
        <div className="text-white grid grid-cols-12 gap-4 items-center">
          <div className="col-span-6">
            <Select
              options={Object.keys(enrolledClasses)}
              getOptionLabel={(option) => option}
              changeHandler={handleUcSelection}
              selected={"-1"}
              placeholder="Selecione a UC"
            />
          </div>

          <FaMinus className="text-2xl text-blue-500 w-12" />

          <div className="col-span-2">
            <Select
              key={fromOptions.key}
              options={fromOptions.options}
              getOptionLabel={classToText}
              changeHandler={handleFromSelection}
              selected={"-1"}
              placeholder="TP*"
            />
          </div>

          <FaArrowRightArrowLeft className="text-2xl text-blue-500 w-12" />

          <div className="col-span-2">
            <Select
              key={toOptions.key}
              options={toOptions.options}
              getOptionLabel={classToText}
              changeHandler={handleToSelection}
              selected={"-1"}
              placeholder="TP*"
            />
          </div>
        </div>

        <button
          className="text-xl text-gray-600 hover:text-gray-700 ml-5"
          onClick={removeTrade}
        >
          <FaTrashCan />
        </button>
      </div>
    </div>
  );
}
