import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";
import type { LedgerEntry } from "@/lib/admin-types";
import { getAdminAccessToken } from "../../_shared/auth";

type MonthlyTotals = {
  month: string;
  charges: number;
  payments: number;
  adjustments: number;
  net: number;
};

export async function GET() {
  const token = await getAdminAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const startOfYear = `${new Date().getFullYear()}-01-01`;
    const entries = await supabaseRest<LedgerEntry[]>(
      `ledger_entries?select=entry_date,entry_type,amount&entry_date=gte.${startOfYear}&order=entry_date.asc`,
      "GET",
      token,
    );

    const byMonth = new Map<string, MonthlyTotals>();

    for (const entry of entries) {
      const month = entry.entry_date.slice(0, 7);
      const current = byMonth.get(month) ?? {
        month,
        charges: 0,
        payments: 0,
        adjustments: 0,
        net: 0,
      };

      const amount = Number(entry.amount);
      if (entry.entry_type === "charge") {
        current.charges += Math.abs(amount);
      } else if (entry.entry_type === "payment") {
        current.payments += Math.abs(amount);
      } else {
        current.adjustments += amount;
      }
      current.net += amount;
      byMonth.set(month, current);
    }

    return NextResponse.json(Array.from(byMonth.values()));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load monthly report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
