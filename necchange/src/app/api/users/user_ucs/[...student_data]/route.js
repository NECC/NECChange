import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Fixed: removed duplicate assignment
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function GET(req, context) {
  try {
    const supabase = getSupabaseClient();
    const student_nr = context.params.student_data[0];

    // Fixed: The join syntax for filtering on related tables
    const { data: student_classes_uc, error } = await supabase
      .from('student_lesson')
      .select(`
        class:lesson_id (
          course:course_id (
            name
          )
        )
      `)
      .eq('student_id', student_nr); 

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

   
    if (!student_classes_uc || student_classes_uc.length === 0) {
      return NextResponse.json({ student_classes: [] });
    }

    let student_ucs = [];
    student_classes_uc.forEach((student_class_uc) => {
      const courseName = student_class_uc.class?.course?.name;
      if (courseName && !student_ucs.includes(courseName)) {
        student_ucs.push(courseName);
      }
    });

    return NextResponse.json({ student_classes: student_ucs });

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}