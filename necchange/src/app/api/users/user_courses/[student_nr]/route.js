import { createClient } from "@supabase/supabase-js";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req, context) {
  const token = await getToken({ req });
  const student_nr = context.params.student_nr;

  if (token?.role !== "SUPER_USER" && token?.number !== student_nr) {
    return NextResponse.json(
      { status: "error", error: "Not authorized" },
      { status: 403 }
    );
  }

  try {
    // First, get the user ID from the number
    const { data: user, error: userError } = await supabase
      .from("user")
      .select("number")
      .eq("number", student_nr)
      .single();

    if (userError) throw userError;
    
    if (!user) {
      return NextResponse.json(
        { status: "error", error: "User not found" },
        { status: 404 }
      );
    }

    console.log("User found:", user);

    // Get student lessons with class and course information
    const { data: student_ucs, error } = await supabase
      .from("student_lesson")
      .select(`
        id,
        student_id,
        lesson_id,
        lesson:class!student_lesson_lesson_id_fkey (
          id,
          shift,
          type,
          weekday,
          start_time,
          end_time,
          local,
          course:course!class_course_id_fkey (
            id,
            name,
            year,
            semester
          )
        )
      `)
      .eq("student_id", student_nr)
      .not("lesson_id", "is", null);

    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }

    console.log("Student UCs found:", student_ucs);

    // Check if we got any results
    if (!student_ucs || student_ucs.length === 0) {
      return NextResponse.json({
        status: "ok",
        student_ucs: [],
        message: "No enrolled classes found"
      });
    }

    return NextResponse.json({
      status: "ok",
      student_ucs: student_ucs,
    });
    
  } catch (error) {
    console.error("Error fetching student lessons:", error);
    return NextResponse.json(
      { status: "error", error: error.message },
      { status: 500 }
    );
  }
}