export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }
  return createClient(supabaseUrl, supabaseKey);
}


export async function GET(req, context)  {
  const supabase = getSupabaseClient();
  const email = context.params.email;
  
  const { data: student, error } = await supabase
    .from('user_auth_check')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  console.log(student)
  console.log("Email -> %s",email)
  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ 
      response: "error", 
      message: error.message 
    }, { status: 500 });
  }

  if (!student) {
    return NextResponse.json({ 
      response: "not_found",
      message: "User not found" 
    }, { status: 200 }); 
  }
  
  return NextResponse.json({ 
    response: "success", 
    unique_id: student.uniqueId 
  }, { status: 200 });
}
