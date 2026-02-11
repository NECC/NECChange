import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import axios from "axios";

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

/* Update user */
export async function PUT(req, { params }) {
  try {
    const supabase = getSupabaseClient();
    const { user_id } = params;
    const data = await req.json();
    const is_partner = data.partner === "true" || data.partner === true;

    const { data: updatedUser, error } = await supabase
      .from("user")
      .update({
        name: data.name,
        role: data.role,
        phone: data.phone ? parseInt(data.phone) : null,
        partner: is_partner,
        email: data.email,
      })
      .eq("uniqueid", parseInt(user_id))
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      response: "success",
      user: updatedUser[0],
      updated: updatedUser.length,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { response: "error", message: error.message },
      { status: 500 }
    );
  }
}

/* Delete user */
export async function DELETE(req, { params }) {
  try {
    const supabase = getSupabaseClient();
    const { user_id } = params;
    
    const { data: userData, error: fetchError } = await supabase
      .from("user")
      .select("email, partner")
      .eq("uniqueid", parseInt(user_id))
      .single();
  

    if (fetchError) {
      console.error("Fetch error details:", fetchError);
      return NextResponse.json(
        { response: "error", message: "User not found" },
        { status: 404 }
      );
    }

    if (userData.partner) {
      try {
        await axios.delete(
          `https://sheetdb.io/api/v1/${process.env.NEXT_PUBLIC_SHEETDB_ID}/Email/${encodeURIComponent(userData.email)}`,
          {
            headers: {
              Accept: "application/json",
              Authorization:
                "Basic " +
                btoa(
                  `${process.env.NEXT_PUBLIC_SHEETDB_LOGIN}:${process.env.NEXT_PUBLIC_SHEETDB_PASSWORD}`
                ),
            },
          }
        );
        console.log("SheetDB updated successfully");
      } catch (err) {
        console.error("SheetDB error:", err);
      }
    } else {
      console.log("🤡 Não é partner ->", userData.is_partner);
    }

    const { error: deleteError } = await supabase
      .from("user")
      .delete()
      .eq("uniqueid", parseInt(user_id));

    if (deleteError) {
      console.error("Delete error:", deleteError);
      throw deleteError;
    }
    return NextResponse.json({
      response: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { response: "error", message: error.message },
      { status: 500 }
    );
  }
}  