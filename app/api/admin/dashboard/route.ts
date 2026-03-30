import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase";
import type { LedgerEntry, OverdueResidentRow, Resident, ResidentBalanceRow } from "@/lib/admin-types";
import { applyScheduledBalances } from "@/lib/scheduled-balance";
import { addDays, nextMonthStart, startOfMonth, startOfToday } from "@/lib/rental-period";
import { getAdminAccessToken } from "../_shared/auth";

const RENT_DUE_PATTERN = /Rent due (\d{1,2}\/\d{1,2}\/\d{4}) to (\d{1,2}\/\d{1,2}\/\d{4})/i;
const WEEKLY_RATE = 165;
const MONTHLY_RATE = 650;

const parseUsDate = (value: string) => {
  const [mm, dd, yyyy] = value.split("/").map(Number);
  if (!mm || !dd || !yyyy) {
    return null;
  }
  return new Date(yyyy, mm - 1, dd);
};

export async function GET() {
  const token = await getAdminAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const monthStartIso = `${new Date().toISOString().slice(0, 7)}-01`;
    const [activeBalances, activeResidents, monthPayments, lastRentPayments, rentDueEntries] = await Promise.all([
      supabaseRest<ResidentBalanceRow[]>(
        "v_resident_balances?select=resident_id,full_name,house_name,status,payment_type,move_in_date,move_out_date,balance&status=eq.Active&order=full_name.asc",
        "GET",
        token,
      ),
      supabaseRest<Resident[]>("residents?select=id&status=eq.Active", "GET", token),
      supabaseRest<LedgerEntry[]>(
        `ledger_entries?select=resident_id,amount,entry_type&entry_type=eq.payment&entry_date=gte.${monthStartIso}`,
        "GET",
        token,
      ),
      supabaseRest<Array<{ resident_id: string; entry_date: string }>>(
        `ledger_entries?select=resident_id,entry_date&entry_type=eq.payment&order=entry_date.desc`,
        "GET",
        token,
      ),
      supabaseRest<Array<{ resident_id: string; description: string }>>(
        `ledger_entries?select=resident_id,description&entry_type=eq.charge&description=ilike.${encodeURIComponent("Rent due%")}`,
        "GET",
        token,
      ),
    ]);

    const projectedBalances = await applyScheduledBalances(activeBalances, token);
    const paymentMap = new Map<string, string>();
    for (const payment of lastRentPayments) {
      if (!paymentMap.has(payment.resident_id)) {
        paymentMap.set(payment.resident_id, payment.entry_date);
      }
    }

    const latestDueEndByResident = new Map<string, Date>();
    for (const entry of rentDueEntries) {
      const match = entry.description.match(RENT_DUE_PATTERN);
      if (!match) {
        continue;
      }
      const periodEnd = parseUsDate(match[2]);
      if (!periodEnd) {
        continue;
      }
      const current = latestDueEndByResident.get(entry.resident_id);
      if (!current || periodEnd > current) {
        latestDueEndByResident.set(entry.resident_id, periodEnd);
      }
    }

    const paidThisMonthByResident = new Map<string, number>();
    for (const payment of monthPayments) {
      const existing = paidThisMonthByResident.get(payment.resident_id) ?? 0;
      paidThisMonthByResident.set(payment.resident_id, existing + Math.abs(Number(payment.amount)));
    }

    const today = startOfToday();
    const monthStart = startOfMonth(today);
    const monthStartMonth = monthStart.getMonth();
    const monthStartYear = monthStart.getFullYear();
    let owedThisMonth = 0;
    for (const resident of projectedBalances) {
      let scheduledThisMonth = 0;
      const latestEnd = latestDueEndByResident.get(resident.resident_id) ?? null;

      if (resident.payment_type === "Weekly") {
        let periodStart = latestEnd ? addDays(latestEnd, 1) : monthStart;
        while (periodStart < today) {
          if (periodStart.getFullYear() === monthStartYear && periodStart.getMonth() === monthStartMonth) {
            scheduledThisMonth += WEEKLY_RATE;
          }
          periodStart = addDays(periodStart, 7);
        }
      } else if (resident.payment_type === "Monthly") {
        let periodStart = latestEnd
          ? startOfMonth(addDays(latestEnd, 1))
          : monthStart;
        while (periodStart < today) {
          if (periodStart.getFullYear() === monthStartYear && periodStart.getMonth() === monthStartMonth) {
            scheduledThisMonth += MONTHLY_RATE;
          }
          periodStart = nextMonthStart(periodStart);
        }
      }

      const paidThisMonth = paidThisMonthByResident.get(resident.resident_id) ?? 0;
      owedThisMonth += Math.max(0, scheduledThisMonth - paidThisMonth);
    }

    const overdue: OverdueResidentRow[] = projectedBalances
      .filter((row) => Number(row.balance) > 0 || Number(row.scheduled_due_missing ?? 0) > 0)
      .map((row) => ({
        resident_id: row.resident_id,
        full_name: row.full_name,
        house_name: row.house_name,
        balance: Number(row.balance),
        due_now: Number(row.scheduled_due_missing ?? 0),
        last_payment_date: paymentMap.get(row.resident_id) ?? null,
      }))
      .sort((a, b) => Number(b.balance) - Number(a.balance));

    const totalOwed = overdue.reduce((sum, row) => sum + Number(row.balance), 0);
    const paymentsThisMonth = monthPayments.reduce(
      (sum, row) => sum + Math.abs(Number(row.amount)),
      0,
    );

    return NextResponse.json({
      kpis: {
        activeCount: activeResidents.length,
        totalOwed,
        paymentsThisMonth,
        owedThisMonth,
      },
      overdue,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load dashboard";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
