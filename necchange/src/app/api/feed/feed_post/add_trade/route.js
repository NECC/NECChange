import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(req) {
  const data = await req.json();
  const supabase = getSupabaseClient();
  const { student_nr, trades } = data;

  try {
    // 1. Get student information
    const { data: student, error: studentError } = await supabase
      .from("user")
      .select("id, uniqueid, number")
      .eq("number", student_nr)
      .single();

    if (studentError || !student) {
      console.error("Student lookup error:", studentError);
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const date = new Date();
    const { data: newTrade, error: tradeError } = await supabase
      .from("trade")
      .insert([
        {
          from_student_id: student.id,
          status: "PENDING",
          publish_time: date.toISOString(),
        },
      ])
      .select()
      .single();

    if (tradeError || !newTrade) {
      console.error("Trade creation error:", tradeError);
      return NextResponse.json({ error: "Error creating trade" }, { status: 500 });
    }

    for (const trade of trades) {
      const { data: classFromList, error: fromError } = await supabase
        .from("class")
        .select("id")
        .eq("course_id", trade.ucId)
        .eq("type", trade.type)
        .eq("shift", trade.fromShift);

      const { data: classToList, error: toError } = await supabase
        .from("class")
        .select("id")
        .eq("course_id", trade.ucId)
        .eq("type", trade.type)
        .eq("shift", trade.toShift);

      if (fromError || toError) {
        console.error("Class lookup error:", { fromError, toError });
        await supabase.from("trade").delete().eq("id", newTrade.id);
        return NextResponse.json({ error: "Invalid classes" }, { status: 400 });
      }

      if (!classFromList?.length) {
        console.error("No 'from' classes found for:", trade);
        await supabase.from("trade").delete().eq("id", newTrade.id);
        return NextResponse.json({ 
          error: `No classes found for shift ${trade.fromShift}` 
        }, { status: 400 });
      }

      if (!classToList?.length) {
        console.error("No 'to' classes found for:", trade);
        await supabase.from("trade").delete().eq("id", newTrade.id);
        return NextResponse.json({ 
          error: `No classes found for shift ${trade.toShift}` 
        }, { status: 400 });
      }

      const switchRecords = [];
      
      for (let i = 0; i < classFromList.length; i++) {
        for (let j = 0; j < classToList.length; j++) {
          const classFrom = classFromList[i];
          const classTo = classToList[j];
          
          switchRecords.push({
            lesson_from_id: classFrom.id,
            lesson_to_id: classTo.id,
            trade_id: newTrade.id
          });
        }
      }

      //console.log("Inserting switch records:", switchRecords);

      const { data: insertedSwitches, error: switchError } = await supabase
        .from("switch")
        .insert(switchRecords)
        .select();

      if (switchError) {
        console.error("Error inserting switches:", switchError);
        await supabase.from("trade").delete().eq("id", newTrade.id);
        return NextResponse.json({ 
          error: "Error creating switches" 
        }, { status: 500 });
      }

      //console.log("Switches created successfully:", insertedSwitches);
    }

    return NextResponse.json({ 
      response: "Success",
      trade_id: newTrade.id
    }, { status: 200 });

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error.message 
    }, { status: 500 });
  }
}