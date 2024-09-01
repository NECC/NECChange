import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function TimeFilter(props) {
  const { setTimeFilter } = props;
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);

  // function to change the filter state
  const handleFilter = (e) => {
    setTimeFilter(e.target.checked);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className="flex flex-col w-full sm:w-40 text-base cursor-pointer">
        <div
          className="flex items-center justify-between bg-gray-50 border px-2 py-1 rounded font-semibold text-gray-500"
          onClick={toggleIsOpen}
        >
          <p className="font-semibold">Mais Recente</p>
          <FiChevronDown
            className={`w-6 h-6 transition-all duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        <div className={`relative z-40 ${!isOpen && "hidden"}`}>
          <form className="w-full sm:w-40 absolute shadow-sm border border-gray-300 rounded py-1 bg-white accent-blue-500 flex flex-col">
            <label className="cursor-pointer hover:bg-gray-100 p-1">
              <input type="checkbox" onChange={handleFilter} className="mr-1" />
              Mais Antigo
            </label>
          </form>
        </div>
      </div>
    </>
  );
}
