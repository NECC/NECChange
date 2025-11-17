import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function PUT(req) {
  try {
    const supabase = getSupabaseClient();
    const params = await req.json();
    
    const isOpen = params.close ? false : true;
    const openDate = isOpen ? params.openDate : null;
    const closeDate = isOpen ? params.closeDate : null;
    
    //console.log("Updating trade period:", { isOpen, openDate, closeDate });

    const { data: existing, error: selectError } = await supabase
      .from("TradePeriods")
      .select("id")
      .maybeSingle();

    if(existing)
      console.log("Existe ->")

    if (selectError) {
      console.error("Supabase select error:", selectError);
      return NextResponse.json({ error: "Failed to check existing trade period" }, { status: 500 });
    }

    if (existing) {
     // console.log(existing.id)
      const { error } = await supabase
        .from("TradePeriods")
        .update({
          isOpen: isOpen,
          openDate: openDate,
          closeDate: closeDate,
        })
        .eq("id", existing.id);

      if (error) {
        console.error("Supabase update error:", error);
        return NextResponse.json({ error: "Failed to update trade period" }, { status: 500 });
      }

    } else {
      const { error } = await supabase
        .from("TradePeriods")
        .insert({
          isOpen: isOpen,
          openDate: openDate,
          closeDate: closeDate,
        });

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json({ error: "Failed to create trade period" }, { status: 500 });
      }
      
      //console.log("Trade period created successfully");
    }

    return NextResponse.json({ 
      response: "Success",
      message: existing ? "Trade period updated" : "Trade period created"
    });
    
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: err.message 
    }, { status: 500 });
  }
}

