import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(req, context) {
  const supabase = getSupabaseClient();
  const student_nr = context.params.student_data[0];
  
  // Supabase query syntax
  const { data: student_classes_uc, error } = await supabase
    .from('student_lesson')
    .select(`
      lesson:lessons (
        course:courses (
          name
        )
      )
    `)
    .eq('user.number', student_nr);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let student_ucs = [];
  student_classes_uc?.forEach((student_class_uc) => {
    const courseName = student_class_uc.lesson?.course?.name;
    if (courseName && !student_ucs.includes(courseName)) {
      student_ucs.push(courseName);
    }
  });

  return NextResponse.json({ student_classes: student_ucs });
}