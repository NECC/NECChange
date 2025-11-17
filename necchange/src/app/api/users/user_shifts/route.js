import { supabase } from "@/utils/supabase";
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


export async function GET(req, context) {
  const ucs = [...req.nextUrl.searchParams.values()].map(Number);
  const supabase = getSupabaseClient();
  const { data: classes, error } = await supabase
    .from("course")
    .select(`
      id,
      name,
      class (
        id,
        type,
        shift
      )
    `)
    .in("id", ucs);

  if (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { status: "error", error: error.message },
      { status: 500 }
    );
  }
  return new NextResponse(JSON.stringify({ classes }));
}
