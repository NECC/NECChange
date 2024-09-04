import UCsObj from "../../data/filters.json";
import { FaMapPin } from "react-icons/fa";
import { IoIosBookmarks } from "react-icons/io";
import { FcClock, FcCalendar } from "react-icons/fc";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

export default function PopUpOnClick(props) {
  const { isOpened, setIsOpened, data, calendarData } = props;

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
    <Modal isOpen={isOpened} onOpenChange={(isOpen) => setIsOpened(isOpen)}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 items-center">{UC.name}</ModalHeader>
            <ModalBody>
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
              {UC.eventTime != "" && (
                <div className={`flex justify-center`}>
                  <FcClock className={`mt-[3px] mr-1 text-xl`} /> {UC.eventTime}h
                </div>
              )}
            </ModalBody>
            <ModalFooter className="flex justify-center">
              <Button color="danger" variant="light" onPress={onClose}>
                Fechar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
