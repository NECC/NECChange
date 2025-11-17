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
  const fromStudentNr = data.params.fromStudentNr;
  const studentNrAccepted = data.params.studentAcceptedNr;
  const tradeId = data.params.tradeId;

  //console.log("Accept trade request:", { fromStudentNr, studentNrAccepted, tradeId });

  if (fromStudentNr === studentNrAccepted) {
    return NextResponse.json({
      response: false,
      error: "Cannot accept your own trade"
    }, { status: 400 });
  }

  try {
    // Get the accepting student
    const { data: toStudent, error: studentError } = await supabase
      .from("user")
      .select("id, number")
      .eq("number", studentNrAccepted)
      .single();

    if (studentError || !toStudent) {
      console.error("Student lookup error:", studentError);
      return NextResponse.json({ 
        response: false,
        error: "Student not found" 
      }, { status: 404 });
    }

    // Get the trade with switches and the from_student info
    const { data: tradeRecord, error: tradeError } = await supabase
      .from("trade")
      .select(`
        id, 
        from_student_id,
        status,
        from_student:user!trade_from_student_id_fkey (
          id,
          number
        ),
        switch!switch_trade_id_fkey (
          id,
          lesson_from_id, 
          lesson_to_id
        )
      `)
      .eq("id", tradeId)
      .single();

    if (tradeError || !tradeRecord) {
      console.error("Trade lookup error:", tradeError);
      return NextResponse.json({ 
        response: false,
        error: "Trade not found" 
      }, { status: 404 });
    }

    //console.log("Trade record:", tradeRecord);

    const fromStudentId = tradeRecord.from_student_id;
    const fromStudentNumber = tradeRecord.from_student.number;
    const toStudentId = toStudent.id;
    const toStudentNumber = toStudent.number;
    const switches = tradeRecord.switch || [];

    if (tradeRecord.status !== "PENDING") {
      return NextResponse.json({ 
        response: false,
        error: "Trade is not available anymore" 
      }, { status: 400 });
    }

    // Check if the accepting student has all required classes
    let ableToTrade = true;
    let missingLesson = null;

    for (const sw of switches) {
      const { data: lessonsOwned, error } = await supabase
        .from("student_lesson")
        .select("id")
        .eq("student_id", toStudentNumber)  // Use student number
        .eq("lesson_id", sw.lesson_to_id);

      if (error || !lessonsOwned?.length) {
        console.log("Student doesn't have lesson:", sw.lesson_to_id);
        ableToTrade = false;
        missingLesson = sw.lesson_to_id;
        break;
      }
    }

    if (!ableToTrade) {
      return NextResponse.json({ 
        response: false,
        error: `You don't have the required class (ID: ${missingLesson}) for this trade` 
      }, { status: 400 });
    }

    for (const sw of switches) {
      //console.log(`Swapping: ${fromStudentNumber} (${sw.lesson_from_id} -> ${sw.lesson_to_id})`);
      //console.log(`         ${toStudentNumber} (${sw.lesson_to_id} -> ${sw.lesson_from_id})`);
      
      // Update from student's lesson
      const { error: updateFrom } = await supabase
        .from("student_lesson")
        .update({ lesson_id: sw.lesson_to_id })
        .eq("student_id", fromStudentNumber)  // Use student number
        .eq("lesson_id", sw.lesson_from_id);

      if (updateFrom) {
        console.error("Error updating from student lesson:", updateFrom);
      }

      // Update to student's lesson
      const { error: updateTo } = await supabase
        .from("student_lesson")
        .update({ lesson_id: sw.lesson_from_id })
        .eq("student_id", toStudentNumber)  // Use student number
        .eq("lesson_id", sw.lesson_to_id);

      if (updateTo) {
        console.error("Error updating to student lesson:", updateTo);
      }
    }
    console.log("Class swaps completed");

    await deleteDeprecatedTrades(supabase, fromStudentId, toStudentId, tradeId, switches);

    // Update the trade status
    const { error: updateError } = await supabase
      .from("trade")
      .update({
        close_time: new Date().toISOString(),
        to_student_id: toStudentId,
        status: "ACCEPTED",
      })
      .eq("id", tradeId);

    if (updateError) {
      console.error("Error updating trade status:", updateError);
      return NextResponse.json({ 
        response: false,
        error: "Failed to update trade" 
      }, { status: 500 });
    }

    console.log("Trade accepted successfully");

    return NextResponse.json({ response: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ 
      response: false,
      error: "Internal error",
      details: error.message 
    }, { status: 500 });
  }
}

// =====================================================
// Helper functions
// =====================================================
async function deleteDeprecatedTrades(supabase, fromStudentId, toStudentId, acceptedTradeId, switches) {
  try {
    const lessonFromIds = switches.map(sw => sw.lesson_from_id);
    const lessonToIds = switches.map(sw => sw.lesson_to_id);

    // Get trades from the "from" student
    const { data: fromTrades } = await supabase
      .from("trade")
      .select(`
        id,
        switch!switch_trade_id_fkey (
          lesson_from_id
        )
      `)
      .eq("from_student_id", fromStudentId)
      .eq("status", "PENDING");

    const { data: toTrades } = await supabase
      .from("trade")
      .select(`
        id,
        switch!switch_trade_id_fkey (
          lesson_from_id
        )
      `)
      .eq("from_student_id", toStudentId)
      .eq("status", "PENDING");

    const idsToRemove = [
      ...collectTradeIds(fromTrades, lessonFromIds),
      ...collectTradeIds(toTrades, lessonToIds),
    ];

    const filteredIds = idsToRemove.filter(id => id !== acceptedTradeId);

    if (filteredIds.length > 0) {
      console.log("Removing deprecated trades:", filteredIds);
      await supabase
        .from("trade")
        .update({
          close_time: new Date().toISOString(),
          status: "REMOVED",
        })
        .in("id", filteredIds);
    }
  } catch (error) {
    console.error("Error in deleteDeprecatedTrades:", error);
  }
}

function collectTradeIds(trades, lessonIds) {
  if (!trades) return [];
  
  const ids = [];
  for (const trade of trades) {
    const switches = trade.switch || [];
    if (switches.some(sw => lessonIds.includes(sw.lesson_from_id))) {
      ids.push(trade.id);
    }
  }
  return ids;
}