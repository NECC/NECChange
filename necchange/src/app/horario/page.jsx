"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import StudentSchedule from "@/components/schedule/StudentSchedule";
import Loader from "@/components/globals/Loader";

export default function Home() {
  const [classes, setClasses] = useState([]);
  const [loader, setLoader] = useState(false);
  const { data: session } = useSession();

  const toggleLoader = (value) => {
    setLoader(value);
  };

  useEffect(() => {
    if (!session) return;
    toggleLoader(true)
    axios
      .get(`/api/schedule/student_schedule/${session.user?.number}`)
      .then((response) => {
        setClasses(response.data.response);
        toggleLoader(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toggleLoader(false)
      });
  }, [session]);

  return (
    <div className="flex justify-center pt-24">
      <div className="container py-2 sm:py-8 px-2">
        <StudentSchedule events={classes} />
      </div>
      {loader && <Loader />}
    </div>
  );
}
