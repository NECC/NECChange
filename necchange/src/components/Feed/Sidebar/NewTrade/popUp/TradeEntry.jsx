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
    /*
    console.log("UC selected:", selected);
    console.log("Enrolled classes:", enrolledClasses);
    console.log("Available classes:", availableClasses);
    */
    setUcSelection(selected);
    
    if (!enrolledClasses[selected]) {
      console.error("Selected UC not found in enrolledClasses:", selected);
      return;
    }
    
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
    /*
    console.log("From selected:", selected);
    console.log("UC Selection:", ucSelection);
    console.log("Available classes for UC:", availableClasses[ucSelection]);
    */

    if (!ucSelection) {
      console.error("No UC selected");
      return;
    }
    
    if (!availableClasses[ucSelection]) {
      console.error("UC not found in availableClasses:", ucSelection);
      toast.warning(`Não há turmas disponíveis para troca em "${ucSelection}"`);
      return;
    }
    
    updateTrade({
      type: selected.type,
      fromShift: selected.shift,
      toShift: 0,
    });
    
    const available = availableClasses[ucSelection].classes.filter(
      ({ type, shift }) => type === selected.type && shift !== selected.shift
    );
    
    //console.log("Available options for 'to':", available);
    
    if (available.length === 0) {
      toast.info(`Não há outras turmas de ${classMap[selected.type]} disponíveis para troca`);
    }
    
    setToOptions({
      options: available,
      key: toOptions.key + 1,
    });
  };

  const handleToSelection = (selected) => {
    //console.log("To selected:", selected);
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
              selected={ucSelection || "-1"}
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
              disabled={!ucSelection}
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
              disabled={toOptions.options.length === 0}
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