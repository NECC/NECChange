import { NextResponse } from "next/server";
import axios from "axios";
import { supabase } from "@/utils/supabase";
// Inicializar Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export async function GET(request, context) {
  const student_nr = context.params.student_nr;

  const { data: studentClasses, error } = await supabase
  .from('student_class')
  .select(`
    *,
    student_lesson (
      lesson (
        weekday,
        start_time,
        end_time,
        local,
        shift,
        type,
        course (
          name
        )
      )
    )
  `)
  .eq('number', student_nr);

if (error) {
  console.error('Error:', error);
  return;
}

  let classes = [];
  studentClasses.student_lesson.map((studentClass) => {

    if(studentClass.lesson != null) {
    
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;

      if (month < 10) month = "0" + month;

      let days_in_month = new Date(year, month, 0).getDate();
      let day = date.getDate() + studentClass.lesson.weekday - date.getDay();

      if (day > days_in_month) {
        day = day % days_in_month;
        month++;
        if (month < 10) {
          month = "0" + month;
        }
      }

      if (day <= 0) {
        month--;
        days_in_month = new Date(year, month, 0).getDate();
        day = (day % days_in_month) + days_in_month;
        if (month < 10) {
          month = "0" + month;
        }
      }

      if (day < 10) {
        day = "0" + day;
      }

      let start = new Date(
        year + "-" + month + "-" + day + "T" + studentClass.lesson.start_time
      );
      let end = new Date(
        year + "-" + month + "-" + day + "T" + studentClass.lesson.end_time
      );

      let type_class = {
        1: "T",
        2: "TP",
        3: "PL",
      };

      let shift = studentClass.lesson.shift;
      let type = type_class[studentClass.lesson.type];
      let uc_name = studentClass.lesson.course.name;
      classes.push({
        title: uc_name + " - " + type + shift + " - " + studentClass.lesson.local,

        uc_name: uc_name,
        type: type,
        shift: shift,
        start: start,
        end: end,
      });
    }
  });

  return new NextResponse(JSON.stringify({ response: classes }));
}
