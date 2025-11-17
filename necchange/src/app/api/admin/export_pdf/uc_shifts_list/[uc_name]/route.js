import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const type_class = {
  1: "T",
  2: "TP",
  3: "PL",
};

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(req, context) {
  const uc_name = context.params.uc_name;

  try {
    const supabase = getSupabaseClient();
    const { data: uc_shifts, error: shiftsError } = await supabase
      .from("lesson")
      .select("course_id, type, shift, course(name)")
      .eq("course.name", uc_name)
      .order("course_id", { ascending: true });

    if (shiftsError) {
      console.error("Error fetching UC shifts:", shiftsError);
      return NextResponse.json(
        { error: "Failed to fetch shifts" },
        { status: 500 }
      );
    }

    // Extract unique shift combinations
    const uniqueShifts = [];
    const seen = new Set();
    for (const s of uc_shifts || []) {
      const key = `${s.course_id}-${s.type}-${s.shift}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueShifts.push({
          course_id: s.course_id,
          type: s.type,
          shift: s.shift,
        });
      }
    }

    
    const data = {};
    for (const uc_shift of uniqueShifts) {
      const { data: students, error: studentsError } = await supabase
        .from("student_lesson")
        .select("user:user_id(number), lesson:lesson_id(course_id, type, shift)")
        .eq("lesson.course_id", uc_shift.course_id)
        .eq("lesson.type", uc_shift.type)
        .eq("lesson.shift", uc_shift.shift);

      if (studentsError) {
        console.error(
          `Error fetching students for shift ${uc_shift.type}-${uc_shift.shift}:`,
          studentsError
        );
        continue;
      }

      const studentNumbers = [
        ...new Set(students.map((s) => s.user?.number).filter(Boolean)),
      ];
      const label = `${type_class[uc_shift.type]}${uc_shift.shift}`;
      data[label] = studentNumbers;
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
