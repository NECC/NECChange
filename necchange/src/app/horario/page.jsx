"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import StudentSchedule from "@/components/schedule/StudentSchedule";
import Loader from "@/components/globals/Loader";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

export default function Home() {
  const [classes, setClasses] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isPopUpOpened, setIsPopUpOpened] = useState(false);
  const [popUpEvent, setPopUpEvent] = useState(null);
  const { data: session } = useSession();

  const toggleLoader = (value) => {
    setLoader(value);
  };

  useEffect(() => {
    if (!session) return;
    
    toggleLoader(true);
    
    axios
      .get(`/api/schedule/student_schedule/${session.user?.number}`)
      .then((response) => {
        setClasses(response.data.response);
        toggleLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toggleLoader(false);
      });
  }, [session]);

  const parseTime = (time) => {
    return time.toLocaleTimeString('pt-PT', { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const weekday = (date) => {
    return date.toLocaleDateString('pt-PT', { weekday: 'short' });
  };

  return (
    <div className="flex justify-center pt-24">
      <Modal isOpen={isPopUpOpened} onOpenChange={(isOpen) => setIsPopUpOpened(isOpen)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                {popUpEvent && (
                  <div className="flex justify-center mt-2 text-md text-gray-500">
                    {weekday(popUpEvent.start)}, {parseTime(popUpEvent.start)} - {parseTime(popUpEvent.end)}
                  </div>
                )}
              </ModalBody>
              <ModalHeader className="flex flex-col gap-1 items-center">
                {popUpEvent?.title}
              </ModalHeader>
              <ModalFooter className="flex justify-center">
                <Button color="danger" variant="light" onPress={onClose}>
                  Fechar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="container py-2 sm:py-8 px-2">
        <StudentSchedule 
          events={classes} 
          onEventClick={(info) => {
            setPopUpEvent(info.event);
            setIsPopUpOpened(true);
          }} 
        />
      </div>
      {loader && <Loader />}
    </div>
  );
}