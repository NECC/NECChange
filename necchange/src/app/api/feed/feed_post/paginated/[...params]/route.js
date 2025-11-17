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
    const routeParams = params?.params || [];
    
    const cursor = routeParams[0] ? parseInt(routeParams[0]) : 1;
    const student_nr = routeParams[1];
    const filtered_ucs_encoded = routeParams[2] || "";
    
    const LIMIT = 5;

    if (!student_nr) {
      return NextResponse.json(
        { error: "Student number is required" },
        { status: 400 }
      );
    }

    //console.log("Pagination params:", { cursor, student_nr, filtered_ucs_encoded });

    let filtered_ucs = [];
    if (filtered_ucs_encoded) {
      try {
        const decoded = decodeURIComponent(filtered_ucs_encoded);
        filtered_ucs = decoded.split('&').filter(Boolean);
      } catch (e) {
        console.error("Error decoding UCs:", e);
      }
    }

    const { data: userData, error: userError } = await supabase
      .from('user')
      .select('id')
      .eq('student_number', student_nr)
      .single();

    if (userError || !userData) {
      console.error("Error fetching user:", userError);
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    const { data: trades, error: tradesError } = await supabase
      .from('trade')
      .select(`
        id,
        from_student_id,
        to_student_id,
        status,
        publish_time,
        close_time,
        from_student:user!trade_from_student_id_fkey (
          id,
          student_number,
          name,
          email
        ),
        switches:switch (
          id,
          lesson_from:class!switch_lesson_from_id_fkey (
            id,
            name,
            shift,
            course:uc (
              id,
              name,
              code
            )
          ),
          lesson_to:class!switch_lesson_to_id_fkey (
            id,
            name,
            shift,
            course:uc (
              id,
              name,
              code
            )
          )
        )
      `)
      .in('status', ['PENDING', 'OPEN'])
      .lt('id', cursor)
      .order('publish_time', { ascending: false })
      .limit(LIMIT);

    if (tradesError) {
      console.error("Supabase error:", tradesError);
      return NextResponse.json(
        { error: tradesError.message },
        { status: 500 }
      );
    }

    let feedPosts = trades.map(trade => ({
      id: trade.id,
      created_at: trade.publish_time,
      from_student: {
        number: trade.from_student.student_number,
        name: trade.from_student.name,
        email: trade.from_student.email
      },
      trade_id: trade.switches.map(sw => ({
        id: sw.id,
        lessonFrom: {
          id: sw.lesson_from.id,
          shift: sw.lesson_from.shift,
          course: {
            id: sw.lesson_from.course.id,
            name: sw.lesson_from.course.name,
            code: sw.lesson_from.course.code
          },
          class: {
            name: sw.lesson_from.name
          }
        },
        lessonTo: {
          id: sw.lesson_to.id,
          shift: sw.lesson_to.shift,
          course: {
            id: sw.lesson_to.course.id,
            name: sw.lesson_to.course.name,
            code: sw.lesson_to.course.code
          },
          class: {
            name: sw.lesson_to.name
          }
        }
      }))
    }));

    if (filtered_ucs.length > 0) {
      feedPosts = feedPosts.filter(post => {
        const postCourses = post.trade_id
          .map(trade => trade.lessonFrom?.course?.name)
          .filter(Boolean);
        
        return filtered_ucs.every(uc => postCourses.includes(uc));
      });
    }

    const newCursor = feedPosts.length > 0
      ? Math.min(...feedPosts.map(post => post.id))
      : cursor;

    //console.log(`Fetched ${feedPosts.length} posts, new cursor: ${newCursor}`);

    return NextResponse.json(
      {
        response: feedPosts,
        cursor: newCursor
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (err) {
    console.error("Unexpected error in paginated route:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}