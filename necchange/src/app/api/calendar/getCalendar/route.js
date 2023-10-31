// Get events from Google Calendar

function getColor(title) {
  // text-sky-500 : #0ea4e9
  // text-cian-500 : #06b5d4
  // text-teal-500 : #14b8a5
  // text-violet-500 : #8a5cf6
  // yellow : #FACC15
  // green : #22C55E
  // red : #EF4444

  if (title.search("1[ º]*ano") != -1) return "#407cde";
  if (title.search("2[ º]*ano") != -1) return "#10b981";
  if (title.search("3[ º]*ano") != -1) return "#8b5cf6";
  return "#0ea4e9";
}

import axios from "axios";
import { NextResponse } from "next/server";
export async function GET(req, res) {
  const { data } = await axios.get(
    `https://www.googleapis.com/calendar/v3/calendars/${process.env.NEXT_PUBLIC_GOOGLECALENDAR_CALENDAR_ID}/events?key=${process.env.NEXT_PUBLIC_GOOGLECALENDAR_API_KEY}`
  );

  const events = data.items.map((event) => {
    const color = getColor(event.summary);

    return {
      title: event.summary,
      start: event.start.date || event.start.dateTime,
      color: color,
    };
  });

  return NextResponse.json({ response: events });
}
