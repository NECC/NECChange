import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(req, { params }) {
  try {
    const supabase = getSupabaseClient();

    const student_nr = params?.student_data?.[0];
    
    if (!student_nr) {
      return NextResponse.json(
        { error: "Student number is required" },
        { status: 400 }
      );
    }
    
    //console.log("Fetching UCs for student:", student_nr);

    const { data: student_classes_uc, error } = await supabase
      .from('student_lesson')
      .select(`
        lesson:lesson (
          course:course (
            name
          )
        )
      `)
      .eq('student_number', student_nr); 
 
    //console.log("Query result:", student_classes_uc);
    
    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    let student_ucs = [];
    student_classes_uc?.forEach((student_class_uc) => {
      const courseName = student_class_uc.lesson?.course?.name;
      if (courseName && !student_ucs.includes(courseName)) {
        student_ucs.push(courseName);
      }
    });
    
    return NextResponse.json(
      { student_classes: student_ucs },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
    
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}