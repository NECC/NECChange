// Get events from Google Calendar
import axios from "axios";
import { NextResponse } from "next/server";
export async function GET(req: any, res: any) {
  const { data } = await axios.get(
    `https://www.googleapis.com/calendar/v3/calendars/${process.env.NEXT_PUBLIC_GOOGLECALENDAR_CALENDAR_ID}/events?key=${process.env.NEXT_PUBLIC_GOOGLECALENDAR_API_KEY}`
  );

  const events = data.items.map((event: any) => {
    return {
      title: event.summary,
      start: event.start.date || event.start.dateTime,
    };
  });

  return NextResponse.json({response: events});
}