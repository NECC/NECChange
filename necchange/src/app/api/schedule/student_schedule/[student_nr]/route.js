import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request, context) {
  try {
    const supabase = getSupabaseClient();
    const student_nr = context.params.student_nr;

    console.log(`Fetching schedule for student: ${student_nr}`);

    const { data: studentClasses, error } = await supabase
      .from('user')
      .select(`
        *,
        student_lesson (
          class (
            weekday,
            start_time,
            end_time,
            local,
            shift,
            type,
            course (
              name,
              year
            )
          )
        )
      `)
      .eq('number', student_nr);

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      );
    }

    if (!studentClasses || studentClasses.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    console.log('Raw student data:', JSON.stringify(studentClasses, null, 2));

    const student = studentClasses[0];

    if (!student.student_lesson || student.student_lesson.length === 0) {
      return NextResponse.json(
        { response: [] },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        }
      );
    }

    let classes = [];
    const today = new Date();

    student.student_lesson.forEach((studentClass) => {
      if (studentClass.class != null) {
        const targetWeekday = studentClass.class.weekday; // 0 = Sunday, 1 = Monday, etc.
        const currentWeekday = today.getDay();
  
        let daysDiff = targetWeekday - currentWeekday;

        const classDate = new Date(today);
        classDate.setDate(today.getDate() + daysDiff);

        const year = classDate.getFullYear();
        const month = String(classDate.getMonth() + 1).padStart(2, '0');
        const day = String(classDate.getDate()).padStart(2, '0');
        
        const start = new Date(
          `${year}-${month}-${day}T${studentClass.class.start_time}`
        );
        const end = new Date(
          `${year}-${month}-${day}T${studentClass.class.end_time}`
        );

        const type_class = {
          1: "T",
          2: "TP",
          3: "PL",
        };

        const shift = studentClass.class.shift;
        const type = type_class[studentClass.class.type];
        const uc_name = studentClass.class.course.name;
        const ano = studentClass.class.course.year;

        classes.push({
          title: `${uc_name} - ${type}${shift} - ${studentClass.class.local}`,
          uc_name: uc_name,
          ano: ano,
          type: type,
          shift: shift,
          start: start,
          end: end,
          local: studentClass.class.local,
        });
      }
    });

    //console.log(`Processed ${classes.length} classes:`, JSON.stringify(classes, null, 2));

    return NextResponse.json(
      { response: classes },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
        }
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;