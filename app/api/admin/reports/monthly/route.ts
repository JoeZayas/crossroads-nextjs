import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";
import type { LedgerEntry } from "@/lib/admin-types";
import { getAdminAccessToken } from "../../_shared/auth";

// Internal accumulator uses integer cents to avoid floating-point drift
// (e.g. $650 + $165 + $650 = $1,464.9999999999998).  Values are divided by 100
// only when building the final response.
type MonthlyTotalsCents = {
  month: string;
  chargesCents: number;
  paymentsCents: number;
  adjustmentsCents: number;
  netCents: number;
};

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

    const byMonth = new Map<string, MonthlyTotalsCents>();

    for (const entry of entries) {
      const month = entry.entry_date.slice(0, 7);
      const current = byMonth.get(month) ?? {
        month,
        chargesCents: 0,
        paymentsCents: 0,
        adjustmentsCents: 0,
        netCents: 0,
      };

      const amountCents = Math.round(Number(entry.amount) * 100);
      if (entry.entry_type === "charge") {
        current.chargesCents += Math.abs(amountCents);
      } else if (entry.entry_type === "payment") {
        current.paymentsCents += Math.abs(amountCents);
      } else {
        current.adjustmentsCents += amountCents;
      }
      current.netCents += amountCents;
      byMonth.set(month, current);
    }

    const result: MonthlyTotals[] = Array.from(byMonth.values()).map((row) => ({
      month: row.month,
      charges: row.chargesCents / 100,
      payments: row.paymentsCents / 100,
      adjustments: row.adjustmentsCents / 100,
      net: row.netCents / 100,
    }));

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load monthly report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
