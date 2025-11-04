import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(req) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(req.url);
    let query = supabase.from("testes").select("*");
    const { data, error } = await query;
    
    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch events" },
        { status: 500 }
      );
    }
    
    const groupedData = {};
    data?.forEach((event) => {
      const ano = event.ano;
      if (!groupedData[ano]) {
        groupedData[ano] = [];
      }
      groupedData[ano].push({
        id: event.id, 
        uc: event.uc,
        day: event.day,
        type: event.type,
        start: event.start || "00:00",
        end: event.end || "01:00",
      });
    });
    
    return NextResponse.json({ response: groupedData });
  } catch (err) {
    console.error("Error in GET:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const supabase = getSupabaseClient();
    const data = await req.json();
    const { uc, ano, day, type, start, end } = data;
    
    if (!uc || !day || !type) {
      return NextResponse.json(
        { error: "Campos obrigatórios: uc, day, type" },
        { status: 400 }
      );
    }
    
    const { data: newEvent, error } = await supabase
      .from("testes")
      .insert([
        {
          ano,
          uc,
          day,
          type,
          start: start || "00:00",
          end: end || "01:00",
        },
      ])
      .select()
      .single();
    
    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create event" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      response: {
        id: newEvent.id,
        uc: newEvent.uc,
        day: newEvent.day,
        type: newEvent.type,
        start: newEvent.start,
        end: newEvent.end,
      }
    });
  } catch (err) {
    console.error("Error in POST:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Parâmetro obrigatório: id" },
        { status: 400 }
      );
    }
    
    const { data: deletedEvent, error } = await supabase
      .from("testes")
      .delete()
      .eq("id", parseInt(id))
      .select()
      .single();
    
    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Event not found or failed to delete" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ response: deletedEvent });
  } catch (err) {
    console.error("Error in DELETE:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
