# Resident Balance Reset Bug - Fix Summary

## Problem
Resident balances were being calculated incorrectly (appearing to reset) when residents had no recent "Rent due" ledger entries. This affected payment coverage calculations in `lib/scheduled-balance.ts`.

## Root Cause
In `lib/scheduled-balance.ts` lines 128-129 (original code):
```typescript
if (!paymentType || !latestDueEnd) {
  continue;  // PROBLEM: Skip residents without "Rent due" entries entirely
}
```

When a resident had no "Rent due" ledger entries (perhaps because rent_amount was NULL or they were marked inactive at month-start), the payment coverage calculation was skipped. This meant:
1. Their payment history was completely ignored
2. The balance calculation would be incorrect or reset
3. Residents who had paid would show as if they never paid

## Solution
Modified `lib/scheduled-balance.ts` to use `move_in_date` as a fallback baseline when no "Rent due" entries exist:

1. **Added ResidentData type** to track resident payment_type and move_in_date
2. **Created residentDataById Map** to quickly lookup resident metadata
3. **Updated payment coverage loop** to:
   - Not skip residents without latestDueEnd
   - Use their move_in_date as the coverage baseline if no "Rent due" entries exist
   - Apply payment history starting from this baseline

## Changes Made

### File: lib/scheduled-balance.ts

**Added ResidentData type (lines 18-22):**
```typescript
type ResidentData = {
  resident_id: string;
  payment_type: PaymentType | null;
  move_in_date: string | null;
};
```

**Created resident data map (lines 116-123):**
- Maps resident_id to their payment_type and move_in_date
- Enables fallback to move_in_date when no "Rent due" entries exist

**Updated payment coverage calculation (lines 139-179):**
- Changed from `latestDueEnd` to `coverageBaseline`
- Falls back to move_in_date if latestDueEnd is null
- Only skips if both latestDueEnd AND move_in_date are missing
- Correctly applies payment history for all residents with valid baselines

## Impact

### Before Fix
- Residents without "Rent due" entries: Payment history ignored
- Calculated balance appeared to reset at month-end
- Lost visibility of what residents actually owed

### After Fix
- Residents without "Rent due" entries: Payment history properly applied
- Correct balance calculation using payment data from move-in date
- Accurate tracking of resident debt over time

## Verification Steps

To verify this fix works correctly:

1. **Check residents with missing "Rent due" entries:**
```sql
SELECT full_name, status, payment_type, rent_amount
FROM residents r
WHERE NOT EXISTS (
  SELECT 1 FROM ledger_entries le
  WHERE le.resident_id = r.id
  AND le.entry_type = 'charge'
  AND le.description ILIKE 'Rent due%'
);
```

2. **Compare their calculated balance before and after fix:**
   - Before: Payment history ignored, balance appears incorrect
   - After: Payment history properly applied, accurate balance

3. **Verify the admin dashboard shows correct balances:**
   - Residents with payments but no formal "Rent due" entries now show correct amounts
   - No more unexplained balance resets at month-end

## Testing

The fix has been validated:
- ✅ TypeScript compilation passes (no type errors)
- ✅ Logic handles edge cases:
  - Residents with no "Rent due" entries
  - Residents without move_in_date (still skipped as before)
  - Residents with empty payment history (no change)
  - Residents with full history (same logic as before)
