import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import axios from "axios";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

/* Update user */
export async function PUT(req, { params }) {
  try {
    const { user_id } = params;

    const { data: currentUser, error: fetchError } = await supabase
      .from("user")
      .select("email, partner")
      .eq("uniqueid", parseInt(user_id))
      .single();

    const data = await req.json();
    const is_partner = data.partner === "true" || data.partner === true;
    const wasPartner = currentUser.partner;
    const emailChanged = currentUser.email !== data.email;

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

    let sheetDbStatus = null;

    try {
      if (is_partner && !wasPartner) {
        await axios.post(
          `https://sheetdb.io/api/v1/${process.env.NEXT_PUBLIC_SHEETDB_ID}`,
          {
            data: {
              Email: data.email,
              Name: data.name,
              Role: data.role,
              Phone: data.phone || "",
            },
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
        sheetDbStatus = "added";
      }
      else if (!is_partner && wasPartner) {
        await axios.delete(
          `https://sheetdb.io/api/v1/${process.env.NEXT_PUBLIC_SHEETDB_ID}/Email/${encodeURIComponent(currentUser.email)}`,
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
        sheetDbStatus = "removed";
      }
      else if (is_partner && wasPartner) {
        if (emailChanged) {
          await axios.delete(
            `https://sheetdb.io/api/v1/${process.env.NEXT_PUBLIC_SHEETDB_ID}/Email/${encodeURIComponent(currentUser.email)}`,
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
          await axios.post(
            `https://sheetdb.io/api/v1/${process.env.NEXT_PUBLIC_SHEETDB_ID}`,
            {
              data: {
                Email: data.email,
                Name: data.name,
                Role: data.role,
                Phone: data.phone || "",
              },
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
        } else {
          await axios.patch(
            `https://sheetdb.io/api/v1/${process.env.NEXT_PUBLIC_SHEETDB_ID}/Email/${encodeURIComponent(data.email)}`,
            {
              data: {
                Name: data.name,
                Role: data.role,
                Phone: data.phone || "",
              },
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
        }
        sheetDbStatus = "updated";
      }
    } catch (sheetError) {
      sheetDbStatus = "error";
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