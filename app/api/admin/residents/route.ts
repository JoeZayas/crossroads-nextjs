import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";
import type { Resident, ResidentBalanceRow } from "@/lib/admin-types";
import { applyScheduledBalances } from "@/lib/scheduled-balance";
import { getAdminAccessToken } from "../_shared/auth";

const encode = encodeURIComponent;

export async function GET(request: Request) {
  const token = await getAdminAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const houseId = url.searchParams.get("house_id");

    const filters: string[] = [];
    if (status) {
      filters.push(`status=eq.${encode(status)}`);
    }
    if (houseId) {
      filters.push(`house_id=eq.${encode(houseId)}`);
    }

    const query = [
      "select=resident_id,full_name,house_id,house_name,status,payment_type,move_in_date,move_out_date,balance",
      ...filters,
      "order=full_name.asc",
    ].join("&");

    const residents = await supabaseRest<ResidentBalanceRow[]>(`v_resident_balances?${query}`, "GET", token);
    const withScheduledBalances = await applyScheduledBalances(residents, token);
    return NextResponse.json(withScheduledBalances);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load residents";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = await getAdminAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as Partial<Resident>;

    if (!payload.full_name?.trim()) {
      return NextResponse.json({ error: "full_name is required" }, { status: 400 });
    }

    const data = {
      full_name: payload.full_name.trim(),
      house_id: payload.house_id ?? null,
      contract_signed_date: payload.contract_signed_date ?? null,
      move_in_date: payload.move_in_date ?? null,
      move_out_date: payload.move_out_date ?? null,
      payment_type: payload.payment_type ?? null,
      move_in_fee_due: payload.move_in_fee_due ?? 0,
      status: payload.status ?? "Active",
      notes: payload.notes ?? null,
    };

    const created = await supabaseRest<Resident[]>(
      "residents?select=*",
      "POST",
      token,
      data,
      "return=representation",
    );

    return NextResponse.json(created[0], { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create resident";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
