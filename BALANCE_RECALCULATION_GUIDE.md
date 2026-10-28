# Resident Balance Recalculation Guide
## Based on Ledger Data Prior to May 1, 2026

## Problem
All residents' balances were "reset" at the beginning of May 2026, losing track of who owed money from April and earlier months.

## Solution: Recalculate Based on Actual Ledger Data

### Step 1: Apply the Migration
Run this migration to create views that show correct balances as of April 30, 2026:

```bash
# In your Supabase dashboard, go to SQL Editor and run:
# supabase/migrations/20260501_recalculate_balances.sql
```

This creates two new views:
- `v_balances_as_of_apr30_2026` - All residents with their correct balances
- `v_residents_owed_apr30` - Only residents who owe money (balance > 0)

### Step 2: Query the Correct Balances

**To see all resident balances as of April 30, 2026:**
```sql
SELECT 
  full_name,
  status,
  payment_type,
  balance_as_of_apr30,
  total_charges,
  total_payments,
  transaction_count,
  last_transaction_date
FROM v_balances_as_of_apr30_2026
ORDER BY balance_as_of_apr30 DESC;
```

**To see only residents who owe money:**
```sql
SELECT 
  full_name,
  house_name,
  amount_owed,
  total_charges,
  total_payments,
  last_transaction_date
FROM v_residents_owed_apr30
ORDER BY amount_owed DESC;
```

### Step 3: Key Fields Explained

- **balance_as_of_apr30**: Total owed (charges minus payments, as of April 30)
  - Positive number = resident owes this amount
  - Negative number = resident overpaid/has credit
  - $0 = settled

- **total_charges**: Sum of all rent charges from move-in through April 30
- **total_payments**: Sum of all payments made by resident through April 30
- **total_adjustments**: Any adjustments/corrections applied
- **transaction_count**: Number of ledger entries (payments + charges)
- **last_transaction_date**: Most recent activity

### Step 4: Reconcile the Data

Use this query to find discrepancies between the recalculated balance and what's currently in the system:

```sql
SELECT 
  r.full_name,
  r.status,
  r.payment_type,
  vb.balance_as_of_apr30 as correct_balance_apr30,
  vb.total_charges,
  vb.total_payments,
  (SELECT SUM(amount) FROM ledger_entries WHERE resident_id = r.id 
   AND entry_date >= '2026-05-01') as may_charges_and_payments,
  (SELECT SUM(amount) FROM ledger_entries WHERE resident_id = r.id) as current_total_balance,
  CASE 
    WHEN vb.balance_as_of_apr30 > 0 THEN 'OWES $' || to_char(vb.balance_as_of_apr30, '9999.99')
    WHEN vb.balance_as_of_apr30 < 0 THEN 'CREDIT $' || to_char(ABS(vb.balance_as_of_apr30), '9999.99')
    ELSE 'ZERO'
  END as status_apr30
FROM residents r
LEFT JOIN v_balances_as_of_apr30_2026 vb ON vb.resident_id = r.id
ORDER BY vb.balance_as_of_apr30 DESC;
```

### Step 5: Identify the Root Cause

Use this query to see what happened in May (what "reset" the data):

```sql
-- All May 1+ ledger changes
SELECT 
  le.resident_id,
  r.full_name,
  le.entry_date,
  le.entry_type,
  le.amount,
  le.description
FROM ledger_entries le
JOIN residents r ON r.id = le.resident_id
WHERE le.entry_date >= '2026-05-01'
ORDER BY le.entry_date, r.full_name;

-- Changes to residents table in early May
SELECT 
  id,
  full_name,
  status,
  rent_amount,
  updated_at
FROM residents
WHERE updated_at >= '2026-05-01'::timestamp
ORDER BY updated_at DESC;
```

### Step 6: What the Data Shows

Based on the migration, you'll see:

1. **Transaction Count**: How many charges/payments each resident has
   - High count = good tracking history
   - Low count = possible data loss
   
2. **Charges vs Payments**:
   - If charges >> payments = significant debt
   - If payments > charges = paid in advance/credit
   
3. **Last Transaction Date**:
   - Identifies which residents haven't paid recently
   - Shows if data gaps exist

### Step 7: Implementing a Fix

Once you identify the root cause, implement one of these fixes:

#### Fix A: Prevent Future Resets (Recommended)
Add a trigger to prevent accidental deletion of ledger entries:
```sql
CREATE OR REPLACE FUNCTION prevent_ledger_deletion()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.entry_date < CURRENT_DATE - INTERVAL '90 days' THEN
    RAISE EXCEPTION 'Cannot delete ledger entries older than 90 days. This may indicate a bug.';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_ledger_deletion_trigger
BEFORE DELETE ON ledger_entries
FOR EACH ROW
EXECUTE FUNCTION prevent_ledger_deletion();
```

#### Fix B: Add Audit Trail
Track all ledger changes:
```sql
CREATE TABLE ledger_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ledger_id uuid REFERENCES ledger_entries(id),
  action text NOT NULL,
  old_values jsonb,
  new_values jsonb,
  changed_by text,
  changed_at timestamptz DEFAULT now()
);
```

#### Fix C: Restore Missed Charges
If April charges were deleted, recreate them:
```sql
-- This would restore April 1st charges for all active residents
-- Run this ONLY after confirming April charges are missing:
INSERT INTO ledger_entries (
  id, resident_id, house_id, entry_date, entry_type, description, amount
)
SELECT 
  gen_random_uuid(),
  r.id,
  r.house_id,
  '2026-04-01'::date,
  'charge',
  'Rent due 04/01/2026 to 04/30/2026 [restored from backup]',
  r.rent_amount
FROM residents r
WHERE r.status = 'Active'
  AND r.rent_amount IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM ledger_entries le
    WHERE le.resident_id = r.id
      AND le.entry_date = '2026-04-01'
      AND le.entry_type = 'charge'
      AND le.description LIKE '%04/01/2026%'
  );
```

## Summary

The recalculation view (`v_balances_as_of_apr30_2026`) will show you:
1. **Exact amount each resident owed** as of April 30
2. **Total charges and payments** to verify data integrity  
3. **When resets occurred** by examining May entries
4. **Who needs to pay** for April and earlier

Use these queries to identify the root cause, then apply the appropriate fix.
