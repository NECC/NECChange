"use client";
import Image from "next/image";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";

const events = [{ title: "nice event", start: new Date(), resourceId: "a" }];

export default function CalendarPage() {
  return (
    <main className="max-h-screen">
      <div className="p-14 overflow-y-scroll max-h-[60%] calendar-container">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
            googleCalendarPlugin,
          ]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
          }}
          initialView="dayGridMonth"
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          initialEvents={events}
        //   googleCalendarApiKey=""
        //   eventSources={[
        //     {
        //       googleCalendarId: "neccuminho06@gmail.com",
        //     },
        //   ]}
          height={"80vh"}
        />
      </div>
    </main>
  );
}
