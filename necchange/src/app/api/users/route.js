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

/* Get all users */
export async function GET(req, context) {
  try {
    const supabase = getSupabaseClient();
    const { data: users, error } = await supabase
      .from("user")
      .select("uniqueid, partnernumber, number, name, email, phone, partner, role")
      .order("uniqueid", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ response: "success", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { response: "error", message: error.message },
      { status: 500 }
    );
  }
}

/* Add a user */
export async function POST(req, context) {
  try {
    const supabase = getSupabaseClient();
    const data = await req.json();
    const is_partner = data.partner === true;

    // Buscar último partnernumber (apenas de partners)
    const { data: lastPartner, error: partnerError } = await supabase
      .from("user")
      .select("partnernumber")
      .not("partnernumber", "is", null)
      .order("partnernumber", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (partnerError && partnerError.code !== "PGRST116") {
      throw partnerError;
    }

    // Buscar último uniqueid
    const { data: lastUser, error: userError } = await supabase
      .from("user")
      .select("uniqueid")
      .order("uniqueid", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (userError && userError.code !== "PGRST116") {
      throw userError;
    }

    // Calcular novos IDs
    const newPartnerNumber = is_partner
      ? (lastPartner?.partnernumber || 0) + 1
      : null;
    const newUniqueId = (lastUser?.uniqueid || 0) + 1;

    // Criar novo usuário
    const { data: newUser, error: createError } = await supabase
      .from("user")
      .insert({
        uniqueid: newUniqueId,
        partnernumber: newPartnerNumber,
        number: data.number,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        partner: is_partner,
      })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    let sheet_error = false;

    // Atualizar Google Sheets se for partner
    if (is_partner) {
      const new_date = new Date();
      try {
        await axios.post(
          `https://sheetdb.io/api/v1/${process.env.NEXT_PUBLIC_SHEETDB_ID}`,
          {
            data: [
              {
                "": "1",
                Nº: "INCREMENT",
                Nome: newUser.name,
                Numero: newUser.number,
                "Data de Admissão": new_date.toLocaleString("pt-PT"),
                Pago: 10,
                Telefone: newUser.phone,
                Email: newUser.email,
                Vitalício: "TRUE",
                Cartão: "FALSE",
              },
            ],
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
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
        sheet_error = true;
        console.error("SheetDB error:", err);
      }
    }
    else
    {
      console.log("🤡Não é partner ->",is_partner)
    }

    return NextResponse.json({
      response: "success",
      user: newUser,
      sheet_error,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { response: "error", message: error.message },
      { status: 500 }
    );
  }
}

/* Update user */
export async function PUT(req, context) {
  try {
    const supabase = getSupabaseClient();
    const data = await req.json();
    const userId = parseInt(data.userId);
    const is_partner = data.partner === "true" || data.partner === true;

    const { data: updatedUser, error } = await supabase
      .from("user")
      .update({
        name: data.name,
        role: data.role,
        phone: parseInt(data.phone),
        partner: is_partner,
        email: data.email,
      })
      .eq("uniqueid", userId)
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