# Resident Reset Bug Analysis

## Issue
All residents' balances are being reset (cleared/zeroed) at the beginning of the month when some residents owe money.

## Root Cause Analysis

### Key Code Points

1. **Rent Charge Cron Job** (`post_scheduled_rent_charges` in migration 20260426_capture_rent_amount_and_cron.sql)
   - Runs daily at 06:00 UTC
   - On the 1st of each month for Monthly residents (or Mondays for Weekly), it posts a new "Rent due" charge
   - **Critical condition**: Only posts if `rent_amount is not null` (line 30)
   - **Critical condition**: Only posts if `status = 'Active'` (line 29)

2. **Balance Calculation** (`applyScheduledBalances` in lib/scheduled-balance.ts)
   - Looks for "Rent due" ledger entries to find the latest rent period end date
   - If NO rent due entries exist for a resident, `latestDueEndDate` is NULL
   - When `latestDueEndDate` is NULL, the function assumes ONE period is owed (lines 42-44)

3. **Payment Coverage** (lib/scheduled-balance.ts lines 124-159)
   - Maps payments to coverage periods
   - **PROBLEM**: Only processes payments if `latestDueEnd` is not null (line 128: `if (!paymentType || !latestDueEnd) { continue; }`)
   - This means residents with NO recent "Rent due" entries get SKIPPED
   - Their payment history is not applied to coverage calculations

### Suspected Bug Scenarios

**Scenario 1: Null rent_amount**
- If a resident's `residents.rent_amount` is NULL, the cron job won't post charges for them
- They have no "Rent due" entries
- When `applyScheduledBalances` runs, it can't find `latestDueEnd`
- Their balance appears to "reset" because no scheduled charges are calculated

**Scenario 2: Inactive status at month-start**
- If a resident is marked as Inactive on the 1st of the month (perhaps manually by admin)
- The cron job skips them (only charges Active residents)
- Same result as Scenario 1: no "Rent due" entry, balance calculation fails

**Scenario 3: Ledger entries from import that don't match pattern**
- Legacy ledger entries that don't match `/Rent due (\d{1,2}\/\d{1,2}\/\d{4}) to (\d{1,2}\/\d{1,2}\/\d{4})/` pattern
- These won't be recognized as "Rent due" entries
- Won't populate `latestDueEndByResident`
- Payment coverage can't be calculated

## Investigation Steps

### 1. Check for NULL rent_amounts
```sql
SELECT id, full_name, status, payment_type, rent_amount
FROM residents
WHERE rent_amount IS NULL
ORDER BY full_name;
```

### 2. Check for residents without recent Rent due entries
```sql
SELECT DISTINCT r.id, r.full_name, r.status, r.payment_type
FROM residents r
LEFT JOIN ledger_entries le ON le.resident_id = r.id 
  AND le.entry_type = 'charge'
  AND le.description ILIKE 'Rent due%'
WHERE r.status = 'Active'
  AND le.id IS NULL
ORDER BY r.full_name;
```

### 3. Check April 1st cron job execution
Look for "Rent due" entries created on April 1st - if missing, the cron job didn't run or had issues:
```sql
SELECT resident_id, description, entry_date, amount
FROM ledger_entries
WHERE entry_type = 'charge'
  AND description ILIKE 'Rent due%'
  AND entry_date >= (CURRENT_DATE - INTERVAL '30 days')
ORDER BY entry_date DESC;
```

### 4. Check for Inactive residents marked at month-start
```sql
SELECT full_name, status, updated_at
FROM residents
WHERE status = 'Inactive'
ORDER BY updated_at DESC
LIMIT 20;
```

## Potential Fixes

### Fix 1: Ensure all Active residents have rent_amount
- Migration to set default rent amounts for residents missing values
- Validate rent_amount on resident creation/update

### Fix 2: Improve balance calculation for residents without Rent due entries
- In `applyScheduledBalances`, don't skip residents with NULL `latestDueEnd`
- For these residents, assume charges started from their `move_in_date`
- Or: Create backdated "Rent due" entries for missing periods

### Fix 3: Add fallback charge posting
- If a resident is Active but has no charges for the current period
- Automatically create a "Rent due" entry at month-start
- This ensures `latestDueEnd` is always populated

### Fix 4: Audit resident status changes
- Log when resident status changes to/from Inactive
- Ensure status changes are intentional, not accidental system behavior

## Code Path to Investigate

1. When admin dashboard loads, `GET /api/admin/dashboard` is called
2. This calls `applyScheduledBalances` on all Active residents
3. `applyScheduledBalances` queries ledger for:
   - Rent due entries (to find `latestDueEnd`)
   - Payments (to calculate coverage)
4. If a resident has no "Rent due" entries, they fail the coverage calculation
5. Their display might show as "reset" if balances can't be calculated

## Next Steps

1. Run the SQL queries above to identify which residents are affected
2. Check the git history / admin logs for April 1st actions
3. Verify the cron job execution in Supabase logs
4. Implement one of the fixes above to prevent future resets
