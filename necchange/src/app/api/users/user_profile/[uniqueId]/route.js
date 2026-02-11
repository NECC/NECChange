export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Use SERVICE_ROLE_KEY for server-side operations with elevated privileges
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

export async function GET(req, context) {
  const supabase = getSupabaseClient();
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