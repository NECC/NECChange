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
    const student_nr = params?.student_nr;
    const LIMIT = 5;

    if (!student_nr) {
      return NextResponse.json(
        { error: "Student number is required" },
        { status: 400 }
      );
    }

    const { data: userData, error: userError } = await supabase
      .from('user')
      .select('id')
      .eq('number', student_nr)
      .single();

    if (userError || !userData) {
      console.error("Error fetching user:", userError);
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    const userId = userData.id;

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
          number,
          name,
          email
        ),
        switch!switch_trade_id_fkey (
          id,
          lesson_from:class!switch_lesson_from_id_fkey (
            id,
            course_id,
            shift,
            type,
            course:course (
              id,
              name,
              year
            )
          ),
          lesson_to:class!switch_lesson_to_id_fkey (
            id,
            course_id,
            shift,
            type,
            course:course (
              id,
              name,
              year
            )
          )
        )
      `)
      .in('status', ['PENDING', 'ACCEPTED'])
      .order('publish_time', { ascending: false })
      .limit(LIMIT);

    //console.log("Raw trades data:", JSON.stringify(trades, null, 2));
    
    if (tradesError) {
      console.error("Supabase error fetching trades:", tradesError);
      return NextResponse.json(
        { error: tradesError.message },
        { status: 500 }
      );
    }

    const feedPosts = trades.map(trade => {
      //console.log("Processing trade:", trade.id);
      //console.log("Switch data:", trade.switch);
      
      const switches = trade.switch || trade.switches || [];
      
      return {
        id: trade.id,
        status: trade.status,
        publish_time: trade.publish_time,
        created_at: trade.publish_time,
        from_student: {
          number: trade.from_student.number,
          name: trade.from_student.name,
          email: trade.from_student.email
        },
        trade_id: switches.map(sw => {
          console.log("Processing switch:", {
            id: sw.id,
            lesson_from: sw.lesson_from,
            lesson_to: sw.lesson_to
          });
          
          return {
            id: sw.id,
            lessonFrom: {
              id: sw.lesson_from.id,
              shift: sw.lesson_from.shift,
              type: sw.lesson_from.type,
              course: {
                id: sw.lesson_from.course.id,
                name: sw.lesson_from.course.name,
                year: sw.lesson_from.course.year
              }
            },
            lessonTo: {
              id: sw.lesson_to.id,
              shift: sw.lesson_to.shift,
              type: sw.lesson_to.type,
              course: {
                id: sw.lesson_to.course.id,
                name: sw.lesson_to.course.name,
                year: sw.lesson_to.course.year
              }
            }
          };
        })
      };
    });

    //console.log("Transformed feedPosts:", JSON.stringify(feedPosts, null, 2));

    const cursor = feedPosts.length > 0 
      ? Math.min(...feedPosts.map(post => post.id))
      : 1;

    //console.log(`Fetched ${feedPosts.length} posts, cursor: ${cursor}`);

    return NextResponse.json(
      {
        response: feedPosts,
        cursor: cursor
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (err) {
    console.error("Unexpected error in landing route:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}