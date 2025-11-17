import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Disable caching

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'cache-control': 'no-cache, no-store, must-revalidate',
      },
    },
  });
}

export async function GET(Request) {
  try {
    const supabase = getSupabaseClient();
    
    //console.log("STATUS: Fetching trade period...");
   
    const { data, error } = await supabase
      .from("TradePeriods")
      .select("isOpen, openDate, closeDate")
      .eq('id', 1)
      .maybeSingle();
    
    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch trade period" }, 
        { 
          status: 500,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      );
    }
    
    if (!data) {
      console.log("No trade period found in database");
      return NextResponse.json(
        {
          response: "Success",
          status: null,
        },
        {
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        }
      );
    }
    
    //console.log("Trade period data:", data);
    
    return NextResponse.json(
      {
        response: "Success",
        status: data,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }
}