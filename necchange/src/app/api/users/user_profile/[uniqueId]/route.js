import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    `Missing Supabase environment variables: ${!supabaseUrl ? 'URL' : ''} ${!supabaseKey ? 'KEY' : ''}`
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req, context) {
  const uniqueId = parseInt(context.params.uniqueId);
  
  const { data: user_profile, error } = await supabase
    .from("user")
    .select("name, role, phone, partner, email")
    .eq("uniqueid", uniqueId) 
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 404 }
    );
  }

  return NextResponse.json({ profile: user_profile });
}