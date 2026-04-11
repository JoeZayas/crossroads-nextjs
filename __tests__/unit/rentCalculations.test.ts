/**
 * Unit tests for rent calculation logic
 * Mirrors the real Supabase schema for crossroads-soberliving.com
 *
 * Schema reference:
 *   tables: houses, residents, ledger_entries, ledger_import_staging
 *   views:  v_resident_balances, v_last_payment, v_overdue_residents
 *
 * Key constraints:
 *   residents.payment_type CHECK: 'Weekly' | 'Monthly'
 *   residents.status CHECK: 'Active' | 'Inactive'
 *   ledger_entries.entry_type: 'charge' | 'payment' | 'adjustment'
 *   ledger_entries.amount: charges=POSITIVE, payments=NEGATIVE (-abs), balance=SUM(amount)
 *   v_resident_balances: balance > 0 means owes money, negative = credit
 *   v_overdue_residents: status='Active' AND balance > 0
 */

// ---------------------------------------------------------------------------
// RATES — source of truth
// ---------------------------------------------------------------------------

const RATES = {
  houseA: {
    weekly: 165,
    monthly: 650,
    annualPremiumVsWeekly: 780, // 52*165 - 12*650 = 8580 - 7800 = 780
  },
  houseB: {
    weekly: 175,       // effective May 1 2026
    monthly: 700,      // effective May 1 2026
    annualPremiumVsWeekly: 700, // 52*175 - 12*700 = 9100 - 8400 = 700
    effectiveDate: new Date('2026-05-01'),
  },
} as const;

// ---------------------------------------------------------------------------
// Types mirroring the DB schema
// ---------------------------------------------------------------------------

type PaymentType = 'Weekly' | 'Monthly';
type ResidentStatus = 'Active' | 'Inactive';
type EntryType = 'charge' | 'payment' | 'adjustment';

interface LedgerEntry {
  entry_type: EntryType;
  amount: number; // charges=+, payments=-, adjustments=as-is
}

interface Resident {
  id: string;
  name: string;
  status: ResidentStatus;
  payment_type: PaymentType;
  house_id: string;
  move_in_date: Date;
}

// ---------------------------------------------------------------------------
// Helper functions under test
// ---------------------------------------------------------------------------

/**
 * Mirrors SUM(amount) in v_resident_balances.
 * balance > 0 → owes money
 * balance < 0 → has credit
 */
function computeBalance(entries: LedgerEntry[]): number {
  return entries.reduce((sum, e) => sum + e.amount, 0);
}

/**
 * Mirrors merge_ledger_import_staging normalisation:
 *   charge     → +abs(amount)
 *   payment    → -abs(amount)
 *   adjustment → as-is (sign preserved)
 */
function normalizeAmount(entry_type: EntryType, raw: number): number {
  if (entry_type === 'charge') return Math.abs(raw);
  if (entry_type === 'payment') return -Math.abs(raw);
  return raw; // adjustment
}

/**
 * Returns the number of complete weekly or monthly periods that have elapsed
 * since move_in_date up to (but not including) today.
 */
function periodsElapsed(
  move_in_date: Date,
  payment_type: PaymentType,
  asOf: Date = new Date()
): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.floor((asOf.getTime() - move_in_date.getTime()) / msPerDay);
  if (days < 0) return 0;
  if (payment_type === 'Weekly') return Math.floor(days / 7);
  // Monthly: count whole calendar months elapsed using UTC to avoid DST drift
  let months = 0;
  let y = move_in_date.getUTCFullYear();
  let m = move_in_date.getUTCMonth();
  const d = move_in_date.getUTCDate();
  while (true) {
    m++;
    if (m > 11) { m = 0; y++; }
    const next = new Date(Date.UTC(y, m, d));
    if (next > asOf) break;
    months++;
  }
  return months;
}

/**
 * v_overdue_residents predicate:
 *   status = 'Active' AND balance > 0
 */
function isOverdue(resident: Resident, balance: number): boolean {
  return resident.status === 'Active' && balance > 0;
}

/**
 * Annual cost disclosed at intake.
 * Weekly payer:  52 * weeklyRate
 * Monthly payer: 12 * monthlyRate
 */
function annualCost(payment_type: PaymentType, weeklyRate: number, monthlyRate: number): number {
  return payment_type === 'Weekly' ? 52 * weeklyRate : 12 * monthlyRate;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RATES constants', () => {
  test('payment_type values match DB CHECK constraint capitalisation', () => {
    const validTypes: PaymentType[] = ['Weekly', 'Monthly'];
    // ensure no lowercase variants
    expect(validTypes).not.toContain('weekly');
    expect(validTypes).not.toContain('monthly');
    expect(validTypes).toContain('Weekly');
    expect(validTypes).toContain('Monthly');
  });

  test('status values match DB CHECK constraint capitalisation', () => {
    const validStatuses: ResidentStatus[] = ['Active', 'Inactive'];
    expect(validStatuses).toContain('Active');
    expect(validStatuses).toContain('Inactive');
    expect(validStatuses).not.toContain('active');
    expect(validStatuses).not.toContain('inactive');
  });

  test('House A weekly rate is $165', () => {
    expect(RATES.houseA.weekly).toBe(165);
  });

  test('House A monthly rate is $650', () => {
    expect(RATES.houseA.monthly).toBe(650);
  });

  test('House B weekly rate is $175 (effective May 1 2026)', () => {
    expect(RATES.houseB.weekly).toBe(175);
  });

  test('House B monthly rate is $700 (effective May 1 2026)', () => {
    expect(RATES.houseB.monthly).toBe(700);
  });
});

describe('Annual cost disclosure math (shown at intake)', () => {
  test('House A weekly annual cost: 52 × $165 = $8,580', () => {
    expect(annualCost('Weekly', RATES.houseA.weekly, RATES.houseA.monthly)).toBe(8580);
  });

  test('House A monthly annual cost: 12 × $650 = $7,800', () => {
    expect(annualCost('Monthly', RATES.houseA.weekly, RATES.houseA.monthly)).toBe(7800);
  });

  test('House A annual premium (weekly vs monthly): $780/yr', () => {
    const weeklyAnnual = annualCost('Weekly', RATES.houseA.weekly, RATES.houseA.monthly);
    const monthlyAnnual = annualCost('Monthly', RATES.houseA.weekly, RATES.houseA.monthly);
    expect(weeklyAnnual - monthlyAnnual).toBe(RATES.houseA.annualPremiumVsWeekly);
    expect(weeklyAnnual - monthlyAnnual).toBe(780);
  });

  test('House B weekly annual cost: 52 × $175 = $9,100', () => {
    expect(annualCost('Weekly', RATES.houseB.weekly, RATES.houseB.monthly)).toBe(9100);
  });

  test('House B monthly annual cost: 12 × $700 = $8,400', () => {
    expect(annualCost('Monthly', RATES.houseB.weekly, RATES.houseB.monthly)).toBe(8400);
  });

  test('House B annual premium (weekly vs monthly): $700/yr', () => {
    const weeklyAnnual = annualCost('Weekly', RATES.houseB.weekly, RATES.houseB.monthly);
    const monthlyAnnual = annualCost('Monthly', RATES.houseB.weekly, RATES.houseB.monthly);
    expect(weeklyAnnual - monthlyAnnual).toBe(RATES.houseB.annualPremiumVsWeekly);
    expect(weeklyAnnual - monthlyAnnual).toBe(700);
  });
});

describe('periodsElapsed()', () => {
  const base = new Date('2026-01-01');

  test('0 periods on move-in day', () => {
    expect(periodsElapsed(base, 'Weekly', base)).toBe(0);
    expect(periodsElapsed(base, 'Monthly', base)).toBe(0);
  });

  test('0 weekly periods after 6 days', () => {
    const d = new Date('2026-01-07'); // 6 days later
    expect(periodsElapsed(base, 'Weekly', d)).toBe(0);
  });

  test('1 weekly period after exactly 7 days', () => {
    const d = new Date('2026-01-08');
    expect(periodsElapsed(base, 'Weekly', d)).toBe(1);
  });

  test('4 weekly periods after 28 days', () => {
    const d = new Date('2026-01-29');
    expect(periodsElapsed(base, 'Weekly', d)).toBe(4);
  });

  test('52 weekly periods after 364 days', () => {
    const d = new Date('2026-12-31'); // 364 days from Jan 1
    expect(periodsElapsed(base, 'Weekly', d)).toBe(52);
  });

  test('0 monthly periods after 30 days but not a full calendar month', () => {
    const d = new Date('2026-01-31'); // 30 days, but Feb 1 not reached
    expect(periodsElapsed(base, 'Monthly', d)).toBe(0);
  });

  test('1 monthly period after exactly 1 calendar month', () => {
    const d = new Date('2026-02-01');
    expect(periodsElapsed(base, 'Monthly', d)).toBe(1);
  });

  test('3 monthly periods after 3 calendar months', () => {
    const d = new Date('2026-04-01');
    expect(periodsElapsed(base, 'Monthly', d)).toBe(3);
  });

  test('12 monthly periods after 12 calendar months', () => {
    const d = new Date('2027-01-01');
    expect(periodsElapsed(base, 'Monthly', d)).toBe(12);
  });

  test('returns 0 for future move-in date', () => {
    const future = new Date('2030-01-01');
    expect(periodsElapsed(future, 'Weekly', base)).toBe(0);
    expect(periodsElapsed(future, 'Monthly', base)).toBe(0);
  });
});

describe('computeBalance() — mirrors SUM(amount) in v_resident_balances', () => {
  test('empty ledger returns 0', () => {
    expect(computeBalance([])).toBe(0);
  });

  test('single charge returns positive balance (owes money)', () => {
    const entries: LedgerEntry[] = [{ entry_type: 'charge', amount: 165 }];
    expect(computeBalance(entries)).toBe(165);
  });

  test('single payment returns negative balance (credit)', () => {
    const entries: LedgerEntry[] = [{ entry_type: 'payment', amount: -165 }];
    expect(computeBalance(entries)).toBe(-165);
  });

  test('charge then full payment nets to zero', () => {
    const entries: LedgerEntry[] = [
      { entry_type: 'charge', amount: 165 },
      { entry_type: 'payment', amount: -165 },
    ];
    expect(computeBalance(entries)).toBe(0);
  });

  test('charge then partial payment leaves positive balance', () => {
    const entries: LedgerEntry[] = [
      { entry_type: 'charge', amount: 650 },
      { entry_type: 'payment', amount: -300 },
    ];
    expect(computeBalance(entries)).toBe(350);
  });

  test('overpayment creates credit (negative balance)', () => {
    const entries: LedgerEntry[] = [
      { entry_type: 'charge', amount: 165 },
      { entry_type: 'payment', amount: -200 },
    ];
    expect(computeBalance(entries)).toBe(-35);
  });

  test('positive adjustment increases balance', () => {
    const entries: LedgerEntry[] = [
      { entry_type: 'charge', amount: 165 },
      { entry_type: 'adjustment', amount: 20 },
    ];
    expect(computeBalance(entries)).toBe(185);
  });

  test('negative adjustment decreases balance', () => {
    const entries: LedgerEntry[] = [
      { entry_type: 'charge', amount: 165 },
      { entry_type: 'adjustment', amount: -20 },
    ];
    expect(computeBalance(entries)).toBe(145);
  });

  test('multi-week scenario: 4 charges, 3 payments', () => {
    const entries: LedgerEntry[] = [
      { entry_type: 'charge', amount: 165 },
      { entry_type: 'payment', amount: -165 },
      { entry_type: 'charge', amount: 165 },
      { entry_type: 'payment', amount: -165 },
      { entry_type: 'charge', amount: 165 },
      { entry_type: 'payment', amount: -165 },
      { entry_type: 'charge', amount: 165 },
    ];
    expect(computeBalance(entries)).toBe(165);
  });
});

describe('normalizeAmount() — mirrors merge_ledger_import_staging', () => {
  test('charge with positive raw amount stays positive', () => {
    expect(normalizeAmount('charge', 165)).toBe(165);
  });

  test('charge with negative raw amount becomes positive', () => {
    expect(normalizeAmount('charge', -165)).toBe(165);
  });

  test('payment with negative raw amount stays negative', () => {
    expect(normalizeAmount('payment', -165)).toBe(-165);
  });

  test('payment with positive raw amount becomes negative', () => {
    expect(normalizeAmount('payment', 165)).toBe(-165);
  });

  test('adjustment with positive raw amount stays positive', () => {
    expect(normalizeAmount('adjustment', 50)).toBe(50);
  });

  test('adjustment with negative raw amount stays negative', () => {
    expect(normalizeAmount('adjustment', -50)).toBe(-50);
  });

  test('adjustment of zero stays zero', () => {
    expect(normalizeAmount('adjustment', 0)).toBe(0);
  });

  test('charge of zero stays zero', () => {
    expect(normalizeAmount('charge', 0)).toBe(0);
  });
});

describe('v_overdue_residents logic (Active + balance > 0)', () => {
  const makeResident = (status: ResidentStatus): Resident => ({
    id: '1',
    name: 'Test Resident',
    status,
    payment_type: 'Weekly',
    house_id: 'house-a',
    move_in_date: new Date('2026-01-01'),
  });

  test('Active resident with positive balance is overdue', () => {
    expect(isOverdue(makeResident('Active'), 165)).toBe(true);
  });

  test('Active resident with zero balance is NOT overdue', () => {
    expect(isOverdue(makeResident('Active'), 0)).toBe(false);
  });

  test('Active resident with credit (negative balance) is NOT overdue', () => {
    expect(isOverdue(makeResident('Active'), -35)).toBe(false);
  });

  test('Inactive resident with positive balance is NOT overdue', () => {
    expect(isOverdue(makeResident('Inactive'), 165)).toBe(false);
  });

  test('Inactive resident with zero balance is NOT overdue', () => {
    expect(isOverdue(makeResident('Inactive'), 0)).toBe(false);
  });

  test('filters overdue from a mixed list of residents', () => {
    const residents: Array<{ resident: Resident; balance: number }> = [
      { resident: makeResident('Active'), balance: 330 },
      { resident: { ...makeResident('Active'), id: '2' }, balance: 0 },
      { resident: { ...makeResident('Inactive'), id: '3' }, balance: 500 },
      { resident: { ...makeResident('Active'), id: '4' }, balance: -10 },
      { resident: { ...makeResident('Active'), id: '5' }, balance: 1 },
    ];
    const overdue = residents.filter(({ resident, balance }) => isOverdue(resident, balance));
    expect(overdue).toHaveLength(2);
    expect(overdue.map(r => r.resident.id)).toEqual(['1', '5']);
  });
});

describe('House B May 1 2026 rates', () => {
  test('House B effective date is May 1 2026', () => {
    expect(RATES.houseB.effectiveDate).toEqual(new Date('2026-05-01'));
  });

  test('House B weekly $175 > House A weekly $165', () => {
    expect(RATES.houseB.weekly).toBeGreaterThan(RATES.houseA.weekly);
    expect(RATES.houseB.weekly - RATES.houseA.weekly).toBe(10);
  });

  test('House B monthly $700 > House A monthly $650', () => {
    expect(RATES.houseB.monthly).toBeGreaterThan(RATES.houseA.monthly);
    expect(RATES.houseB.monthly - RATES.houseA.monthly).toBe(50);
  });

  test('House B weekly 4-week charge = $700', () => {
    const fourWeekCharge = 4 * RATES.houseB.weekly;
    expect(fourWeekCharge).toBe(700);
  });

  test('House B monthly charge equals 4-week weekly charge', () => {
    expect(RATES.houseB.monthly).toBe(4 * RATES.houseB.weekly);
  });

  test('computeBalance after 4 House B weekly charges = $700', () => {
    const entries: LedgerEntry[] = Array.from({ length: 4 }, () => ({
      entry_type: 'charge' as EntryType,
      amount: RATES.houseB.weekly,
    }));
    expect(computeBalance(entries)).toBe(700);
  });

  test('normalizeAmount maps House B payment correctly', () => {
    expect(normalizeAmount('payment', RATES.houseB.monthly)).toBe(-700);
    expect(normalizeAmount('charge', RATES.houseB.weekly)).toBe(175);
  });
});
