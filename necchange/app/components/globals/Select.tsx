interface SelectI {
  options: [any, string][];
  setter: Function;
  selected: string;
  placeholder?: string;
}

const Select = ({ options, setter, selected, placeholder }: SelectI) => {
  return (
    <select
      className="bg-slate-200 cursor-pointer text-base text-slate-900 p-1 rounded w-full"
      name="type"
      defaultValue={selected}
      onChange={(e) => setter(e.target.value)}
    >
      {placeholder && (
        <option value={selected} disabled>
          {placeholder}
        </option>
      )}
      {options.map(([key, value]) => (
        <option value={key} key={key}>
          {value}
        </option>
      ))}
    </select>
  );
};

export default Select;
