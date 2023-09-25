"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import StudentSchedule from "@/components/schedule/StudentSchedule";

export default function Home() {
  const [classes, setClasses] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;
    console.log(session.user?.number);
    axios
      .get(`/api/trades/student_schedule/${session.user?.number}`)
      .then((response) => {
        console.log(response);
        setClasses(response.data.response);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [session]);

  return (
    <div className="flex justify-center pt-36 pb-20">
      <div className="container mx-8">
        <StudentSchedule events={classes} />
      </div>
    </div>
  );
}
