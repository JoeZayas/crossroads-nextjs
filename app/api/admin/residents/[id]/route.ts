import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";
import type { Resident, ResidentBalanceRow } from "@/lib/admin-types";
import { applyScheduledBalances } from "@/lib/scheduled-balance";
import { getAdminAccessToken } from "../../_shared/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const token = await getAdminAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const [residentRows, residentRecord] = await Promise.all([
      supabaseRest<ResidentBalanceRow[]>(
        `v_resident_balances?select=resident_id,full_name,house_id,house_name,status,payment_type,move_in_date,move_out_date,balance&resident_id=eq.${encodeURIComponent(id)}&limit=1`,
        "GET",
        token,
      ),
      supabaseRest<Resident[]>(`residents?select=*&id=eq.${encodeURIComponent(id)}&limit=1`, "GET", token),
    ]);

    const residentRow = await applyScheduledBalances(residentRows, token);

    if (!residentRow[0] || !residentRecord[0]) {
      return NextResponse.json({ error: "Resident not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...residentRow[0],
      ...residentRecord[0],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load resident";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const token = await getAdminAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const payload = (await request.json()) as Partial<Resident>;
    const data = {
      full_name: payload.full_name?.trim(),
      house_id: payload.house_id ?? null,
      contract_signed_date: payload.contract_signed_date ?? null,
      move_in_date: payload.move_in_date ?? null,
      move_out_date: payload.move_out_date ?? null,
      payment_type: payload.payment_type ?? null,
      move_in_fee_due: payload.move_in_fee_due ?? 0,
      status: payload.status ?? "Active",
      notes: payload.notes ?? null,
    };

    const updated = await supabaseRest<Resident[]>(
      `residents?id=eq.${encodeURIComponent(id)}&select=*`,
      "PATCH",
      token,
      data,
      "return=representation",
    );

    if (!updated[0]) {
      return NextResponse.json({ error: "Resident not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update resident";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const token = await getAdminAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await supabaseRest<Resident[]>(`residents?id=eq.${encodeURIComponent(id)}`, "DELETE", token);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete resident";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
