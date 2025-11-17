import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("TradePeriods")
      .select("isOpen, openDate, closeDate")
      .limit(1);


    console.log(data)
    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ error: "Failed to fetch trade period" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      // Nenhum registro encontrado
      return NextResponse.json({ error: "No trade period found" }, { status: 404 });
    }

    const tradePeriod = data[0];

    return NextResponse.json({
      response: "Success",
      status: tradePeriod,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 501 });
  }
}

