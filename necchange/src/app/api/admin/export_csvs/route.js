import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }
    
    return createClient(supabaseUrl, supabaseKey);
  }

const type_class = {
  1: "T",
  2: "TP",
  3: "PL",
};

export async function GET() {
  const fs = require("fs");
  const path = require("path");

  try {
    const supabase = getSupabaseClient();
    const { data: ucs, error: ucError } = await supabase
      .from("course")
      .select("name");

    if (ucError) {
      console.error("Error fetching courses:", ucError);
      return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }

    const folderPath = path.join(process.cwd(), "public/data/output");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    for (const uc of ucs) {
      const { data: students_of_uc, error: studentError } = await supabase
        .from("student_lesson")
        .select(
          `
          user:user_id(number),
          lesson:lesson_id(type, shift, course(name))
        `
        )
        .eq("lesson.course.name", uc.name)
        .order("lesson.shift", { ascending: true });

      if (studentError) {
        console.error("Error fetching students for", uc.name, studentError);
        continue;
      }

      if (!students_of_uc.length) continue;

      const ucFolder = path.join(folderPath, uc.name);
      if (!fs.existsSync(ucFolder)) {
        fs.mkdirSync(ucFolder, { recursive: true });
      }

      let data_alunos = "";
      let shifts = new Set();

      for (const student of students_of_uc) {
        const number = String(student.user.number).toLowerCase();
        const number_format = `,"${number}"`;
        const lessonType = type_class[student.lesson.type];
        const lessonShift = student.lesson.shift;

        if (student.lesson.type !== 1) {
          data_alunos += `"${uc.name}-${lessonType}${lessonShift}${number_format}${number_format}${number_format},","."\n`;
          shifts.add(`${lessonType}${lessonShift}`);
        }
      }

      fs.writeFileSync(path.join(ucFolder, `${uc.name}_alunos`), data_alunos);

 
      let data_shifts = "";
      const blank = '"",';
      shifts.forEach((shift) => {
        data_shifts += `"${uc.name}-${shift}", "${uc.name}-${shift}", ${blank}${blank}S, ${blank}N, ${blank}${blank}${blank}${blank}""\n`;
      });

     
      fs.writeFileSync(path.join(ucFolder, `${uc.name}_turnos`), data_shifts);
    }

    return NextResponse.json({ data: ucs });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
