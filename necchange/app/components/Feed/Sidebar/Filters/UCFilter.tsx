import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface UcsFilterProps {
  setUcsFilter: Function;
  ucsFilter: string[];
  ucsArray: string[];
}

export default function UCFilter(props: UcsFilterProps) {
  const { ucsArray, ucsFilter, setUcsFilter } = props;

  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);

  // function to change the filter state
  const handleFilter = (e: any) => {
    const chosenUc = e.target.id;
    if (ucsFilter.indexOf(chosenUc) == -1) {
      setUcsFilter([...ucsFilter, chosenUc]);
    } else {
      const newFilter = ucsFilter.filter((uc: any) => uc != chosenUc);
      setUcsFilter(newFilter);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className="flex flex-col w-full sm:w-72 text-base cursor-pointer">
        <div
          className="flex items-center justify-between bg-gray-50 border px-2 py-1 rounded"
          onClick={toggleIsOpen}
        >
          <strong className="font-semibold">Unidade Curricular</strong>
          <FiChevronDown
            className={`w-6 h-6 transition-all duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {/* escolhida esta approach porque não é guardado o estado das checkboxes */}
        <div className={`relative z-40 ${!isOpen && "hidden"}`}>
          <form className="w-full sm:w-72 absolute shadow-sm border border-gray-300 rounded py-1 bg-white accent-blue-500 flex flex-col">
            {ucsArray.map((uc, index) => (
              <label
                key={index}
                className="cursor-pointer hover:bg-gray-100 p-1"
              >
                <input
                  type="checkbox"
                  id={uc}
                  name={uc}
                  value={uc}
                  onChange={handleFilter}
                  className="mr-1"
                />{" "}
                {uc}
              </label>
            ))}
          </form>
        </div>
      </div>
    </>
  );
}
