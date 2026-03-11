import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";
import type { EntryType, LedgerEntry, Resident } from "@/lib/admin-types";
import { getAdminAccessToken } from "../../../_shared/auth";

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
    const entries = await supabaseRest<LedgerEntry[]>(
      `ledger_entries?select=id,resident_id,house_id,entry_date,entry_type,description,amount,created_at,updated_at&resident_id=eq.${encodeURIComponent(id)}&order=entry_date.desc,created_at.desc`,
      "GET",
      token,
    );

    return NextResponse.json(entries);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load ledger entries";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const normalizeAmount = (entryType: EntryType, amountInput: number) => {
  const absolute = Math.abs(Number(amountInput));
  if (entryType === "charge") {
    return absolute;
  }
  if (entryType === "payment") {
    return -absolute;
  }
  return Number(amountInput);
};

export async function POST(request: Request, { params }: Params) {
  const token = await getAdminAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const payload = (await request.json()) as {
      entry_date?: string;
      entry_type?: EntryType;
      description?: string;
      amount?: number;
    };

    if (!payload.entry_type || !payload.description || payload.amount === undefined) {
      return NextResponse.json(
        { error: "entry_type, description, and amount are required" },
        { status: 400 },
      );
    }

    const residents = await supabaseRest<Resident[]>(
      `residents?select=id,house_id&id=eq.${encodeURIComponent(id)}&limit=1`,
      "GET",
      token,
    );

    if (!residents[0]) {
      return NextResponse.json({ error: "Resident not found" }, { status: 404 });
    }

    const data = {
      resident_id: id,
      house_id: residents[0].house_id,
      entry_date: payload.entry_date ?? new Date().toISOString().slice(0, 10),
      entry_type: payload.entry_type,
      description: payload.description.trim(),
      amount: normalizeAmount(payload.entry_type, Number(payload.amount)),
    };

    const created = await supabaseRest<LedgerEntry[]>(
      "ledger_entries?select=id,resident_id,house_id,entry_date,entry_type,description,amount,created_at,updated_at",
      "POST",
      token,
      data,
      "return=representation",
    );

    return NextResponse.json(created[0], { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create ledger entry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
