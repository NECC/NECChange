import * as AlertDialog from "@radix-ui/react-alert-dialog";
import UCsObj from "../../data/filters.json";
import { FaMapPin, FaCalendarAlt } from "react-icons/fa";
import { IoIosBookmarks } from "react-icons/io";
import { FaClock } from "react-icons/fa6";
import { CiClock2, CiCalendarDate, CiCalendar } from "react-icons/ci";
import { FcClock, FcCalendar } from "react-icons/fc";


export default function PopUpOnClick(props) {
  const { isOpened, setIsOpened, data, calendarData } = props;
  // console.log(UCsObj)
  // console.log(data)

  const calendarDataSplitted = calendarData?.split("T");

  const calendarTime = calendarDataSplitted?.length > 1 ? calendarDataSplitted[1] : "";
  const calendarDataSplittedFinal = calendarDataSplitted ? calendarDataSplitted[0].split("-") : "";
  const transformedDate = calendarData
  ? `${calendarDataSplittedFinal[2]}/${calendarDataSplittedFinal[1]}/${calendarDataSplittedFinal[0]}`
  : "";

  const colorClass =
    data?.year == 1
      ? "text-blue-500"
      : data?.year == 2
      ? "text-emerald-500"
      : data?.year == 3
      ? "text-violet-500"
      : "text-black";

  const UC = {
    name: UCsObj.filter((uc) => uc.sigla == data?.UC)[0]?.name || "Evento",
    local: data?.local != "" ? data?.local : null,
    time: data?.time != "" ? data?.time : null,
    year: data?.year,
    data: calendarData,
    eventTime: calendarTime.slice(0, -4),
  };

  console.log(UC);

  return (
    <AlertDialog.Root open={isOpened}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" onClick={() => setIsOpened(false)}/>
        <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[400px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <AlertDialog.Title className="text-mauve12 m-0 pb-3 border-b-2 text-[17px] text-center font-bold">
            {UC.name}
          </AlertDialog.Title>

          <AlertDialog.Description className="text-black font-normal mt-4 mb-5 text-[16px] leading-normal flex justify-center flex-col">
            {UC.local && (
              <div className="flex justify-center mb-2">
                <FaMapPin className="mt-1 mr-1 text-red-500" /> {UC.local}
              </div>
            )}
            {UC.time && (
              <div className="flex justify-center mb-2">
                <FcClock className="mt-[3px] mr-1 text-xl" /> {UC.time}
              </div>
            )}
            <div className={`flex justify-center text-black mb-2`}>
              <FcCalendar className="mt-[3px] mr-1 text-xl" /> {transformedDate}
            </div>
            {UC?.year != 0 && (
              <div className={`flex justify-center`}>
                <IoIosBookmarks className={`mt-1 mr-1 ${colorClass}`} /> {UC?.year}° Ano -{" "}
                {data?.type}
              </div>
            )}
            { UC.eventTime != "" && (
              <div className={`flex justify-center`}>
                <FcClock className={`mt-[3px] mr-1 text-xl`} /> {UC.eventTime}h
              </div>
            )}
          </AlertDialog.Description>

          <div className="flex justify-center gap-[25px]">
            <AlertDialog.Action asChild>
              <button
                onClick={() => setIsOpened(false)}
                className="text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
              >
                Close
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
