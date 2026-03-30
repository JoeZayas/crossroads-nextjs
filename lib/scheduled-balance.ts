import type { PaymentType, ResidentBalanceRow } from "@/lib/admin-types";
import { supabaseRest } from "@/lib/supabase";
import { addDays, nextMonthStart, startOfToday } from "@/lib/rental-period";

type RentDueLedgerRow = {
  resident_id: string;
  description: string;
  amount: number;
  entry_date: string;
};

type RentPaymentLedgerRow = {
  resident_id: string;
  amount: number;
  entry_date: string;
};

const WEEKLY_RATE = 165;
const MONTHLY_RATE = 650;
const RENT_DUE_PATTERN = /Rent due (\d{1,2}\/\d{1,2}\/\d{4}) to (\d{1,2}\/\d{1,2}\/\d{4})/i;

const parseUsDate = (value: string) => {
  const [mm, dd, yyyy] = value.split("/").map(Number);
  if (!mm || !dd || !yyyy) {
    return null;
  }
  return new Date(yyyy, mm - 1, dd);
};

const getMissingScheduledAmount = (
  status: string,
  paymentType: PaymentType | null,
  latestDueEndDate: Date | null,
  today: Date,
) => {
  if (status !== "Active" || !paymentType) {
    return 0;
  }

  // If an active resident has no historical rent-due periods yet, assume one current period is owed.
  // This avoids hiding obviously unpaid residents due to missing historical rows.
  if (!latestDueEndDate) {
    return paymentType === "Weekly" ? WEEKLY_RATE : MONTHLY_RATE;
  }

  if (!paymentType || !latestDueEndDate) {
    return 0;
  }

  if (paymentType === "Weekly") {
    let missing = 0;
    let periodStart = addDays(latestDueEndDate, 1);
    while (periodStart < today) {
      missing += WEEKLY_RATE;
      periodStart = addDays(periodStart, 7);
    }
    return missing;
  }

  let missing = 0;
  let periodStart = nextMonthStart(latestDueEndDate);
  while (periodStart < today) {
    missing += MONTHLY_RATE;
    periodStart = nextMonthStart(periodStart);
  }
  return missing;
};

export async function applyScheduledBalances(
  residents: ResidentBalanceRow[],
  token: string,
): Promise<ResidentBalanceRow[]> {
  if (residents.length === 0) {
    return residents;
  }

  const residentIds = residents.map((row) => row.resident_id);
  const inList = residentIds.join(",");
  const [rentDueRows, rentPaymentRows] = await Promise.all([
    supabaseRest<RentDueLedgerRow[]>(
      `ledger_entries?select=resident_id,description,amount,entry_date&entry_type=eq.charge&description=ilike.${encodeURIComponent("Rent due%")}&resident_id=in.(${inList})`,
      "GET",
      token,
    ),
    supabaseRest<RentPaymentLedgerRow[]>(
      `ledger_entries?select=resident_id,amount,entry_date&entry_type=eq.payment&resident_id=in.(${inList})`,
      "GET",
      token,
    ),
  ]);

  const latestDueEndByResident = new Map<string, Date>();
  for (const row of rentDueRows) {
    const match = row.description.match(RENT_DUE_PATTERN);
    if (!match) {
      continue;
    }

    const periodEnd = parseUsDate(match[2]);
    if (!periodEnd) {
      continue;
    }

    const current = latestDueEndByResident.get(row.resident_id);
    if (!current || periodEnd > current) {
      latestDueEndByResident.set(row.resident_id, periodEnd);
    }
  }

  const residentTypeById = new Map(residents.map((resident) => [resident.resident_id, resident.payment_type]));
  const latestPaymentCoverageByResident = new Map<string, Date>();
  for (const row of rentPaymentRows) {
    const paymentType = residentTypeById.get(row.resident_id);
    if (!paymentType) {
      continue;
    }

    const paymentDate = new Date(row.entry_date);
    if (Number.isNaN(paymentDate.getTime())) {
      continue;
    }

    let coveredPeriods = 0;
    let candidateEnd: Date | null = null;
    if (paymentType === "Weekly") {
      coveredPeriods = Math.floor(Math.abs(Number(row.amount)) / WEEKLY_RATE);
      if (coveredPeriods > 0) {
        candidateEnd = addDays(paymentDate, coveredPeriods * 7 - 1);
      }
    } else if (paymentType === "Monthly") {
      coveredPeriods = Math.floor(Math.abs(Number(row.amount)) / MONTHLY_RATE);
      if (coveredPeriods > 0) {
        const end = new Date(paymentDate.getFullYear(), paymentDate.getMonth() + coveredPeriods, 0);
        candidateEnd = end;
      }
    }

    if (!candidateEnd) {
      continue;
    }

    const current = latestPaymentCoverageByResident.get(row.resident_id);
    if (!current || candidateEnd > current) {
      latestPaymentCoverageByResident.set(row.resident_id, candidateEnd);
    }
  }

  const today = startOfToday();
  return residents.map((resident) => {
    const latestDueEnd = latestDueEndByResident.get(resident.resident_id) ?? null;
    const latestPaymentCoverage = latestPaymentCoverageByResident.get(resident.resident_id) ?? null;
    const latestEnd =
      latestDueEnd && latestPaymentCoverage
        ? (latestDueEnd > latestPaymentCoverage ? latestDueEnd : latestPaymentCoverage)
        : (latestDueEnd ?? latestPaymentCoverage);
    const scheduledMissing = getMissingScheduledAmount(
      resident.status,
      resident.payment_type,
      latestEnd,
      today,
    );
    const currentBalance = Number(resident.balance);

    return {
      ...resident,
      raw_balance: currentBalance,
      scheduled_due_missing: scheduledMissing,
      balance: currentBalance + scheduledMissing,
    };
  });
}
