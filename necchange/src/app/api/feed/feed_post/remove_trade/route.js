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
export async function PUT(req, context) {
  try {
    const supabase = getSupabaseClient();
    const data = await req.json();
    const tradeId = parseInt(data.params.tradeId);

    const { data: removeTrade, error } = await supabase
      .from("trade")
      .update({
        status: "REMOVED",
        close_time: new Date().toISOString(),
      })
      .eq("id", tradeId)
      .select()
      .single();

    if (error) {
      console.error("Error removing trade:", error);
      return NextResponse.json(
        { status: "error", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ response: removeTrade });

  } catch (error) {
    console.error("Error in remove trade endpoint:", error);
    return NextResponse.json(
      { status: "error", error: error.message },
      { status: 500 }
    );
  }
}
