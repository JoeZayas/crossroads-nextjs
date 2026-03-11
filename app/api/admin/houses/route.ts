import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";
import type { House } from "@/lib/admin-types";
import { getAdminAccessToken } from "../_shared/auth";

export async function GET() {
  const token = await getAdminAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const houses = await supabaseRest<House[]>(
      "houses?select=id,name,address,is_active&order=name.asc",
      "GET",
      token,
    );
    return NextResponse.json(houses);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load houses";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
