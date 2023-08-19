import { get } from "http";
import React from "react";
interface SelectI {
  options: any[];
  getOptionLabel: (option: any) => string;
  changeHandler: Function;
  selected: string;
  placeholder?: string;
}

const Select = ({
  options,
  getOptionLabel,
  changeHandler,
  selected,
  placeholder,
}: SelectI) => {
  return (
    <select
      className="bg-slate-200 cursor-pointer text-base text-slate-900 p-1 rounded w-full"
      name="type"
      defaultValue={selected}
      onChange={(evt) => changeHandler(options[Number(evt.target.value)])}
    >
      {placeholder && (
        <option value={selected} disabled>
          {placeholder}
        </option>
      )}
      {options.map((option, index) => (
        <option value={index} key={index}>
          {getOptionLabel(option)}
        </option>
      ))}
    </select>
  );
};

export default Select;
