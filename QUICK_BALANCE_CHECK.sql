-- Quick Balance Check: Run these queries in Supabase SQL Editor
-- This will show resident balances based on ledger data before May 1, 2026

-- QUERY 1: Show all residents with their calculated balance as of April 30, 2026
SELECT
  r.full_name,
  r.status,
  r.payment_type,
  r.rent_amount,
  r.move_in_date,
  (
    SELECT COALESCE(SUM(
      CASE
        WHEN le.entry_type = 'charge' THEN le.amount
        WHEN le.entry_type = 'payment' THEN -le.amount
        ELSE le.amount
      END
    ), 0)
    FROM ledger_entries le
    WHERE le.resident_id = r.id
      AND le.entry_date < '2026-05-01'
  )::numeric(10,2) as balance_through_apr30,
  (
    SELECT COALESCE(SUM(le.amount), 0)
    FROM ledger_entries le
    WHERE le.resident_id = r.id
      AND le.entry_type = 'charge'
      AND le.entry_date < '2026-05-01'
  )::numeric(10,2) as total_charges,
  (
    SELECT COALESCE(SUM(le.amount), 0)
    FROM ledger_entries le
    WHERE le.resident_id = r.id
      AND le.entry_type = 'payment'
      AND le.entry_date < '2026-05-01'
  )::numeric(10,2) as total_payments,
  (
    SELECT COUNT(*)
    FROM ledger_entries le
    WHERE le.resident_id = r.id
      AND le.entry_date < '2026-05-01'
  ) as transaction_count,
  (
    SELECT MAX(le.entry_date)
    FROM ledger_entries le
    WHERE le.resident_id = r.id
      AND le.entry_date < '2026-05-01'
  ) as last_transaction_date
FROM residents r
ORDER BY full_name;

-- QUERY 2: Show ONLY residents who owe money (balance > 0) as of April 30
SELECT
  r.full_name,
  r.status,
  r.payment_type,
  (
    SELECT COALESCE(SUM(
      CASE
        WHEN le.entry_type = 'charge' THEN le.amount
        WHEN le.entry_type = 'payment' THEN -le.amount
        ELSE le.amount
      END
    ), 0)
    FROM ledger_entries le
    WHERE le.resident_id = r.id
      AND le.entry_date < '2026-05-01'
  )::numeric(10,2) as amount_owed,
  (
    SELECT MAX(le.entry_date)
    FROM ledger_entries le
    WHERE le.resident_id = r.id
      AND le.entry_date < '2026-05-01'
  ) as last_payment_or_charge_date
FROM residents r
WHERE (
  SELECT COALESCE(SUM(
    CASE
      WHEN le.entry_type = 'charge' THEN le.amount
      WHEN le.entry_type = 'payment' THEN -le.amount
      ELSE le.amount
    END
  ), 0)
  FROM ledger_entries le
  WHERE le.resident_id = r.id
    AND le.entry_date < '2026-05-01'
) > 0
  AND r.status = 'Active'
ORDER BY amount_owed DESC;

-- QUERY 3: Summary - Total owed across all residents as of April 30
SELECT
  COUNT(DISTINCT r.id) as active_residents,
  COUNT(DISTINCT CASE
    WHEN (
      SELECT COALESCE(SUM(
        CASE
          WHEN le.entry_type = 'charge' THEN le.amount
          WHEN le.entry_type = 'payment' THEN -le.amount
          ELSE le.amount
        END
      ), 0)
      FROM ledger_entries le
      WHERE le.resident_id = r.id
        AND le.entry_date < '2026-05-01'
    ) > 0 THEN r.id
  END) as residents_with_debt,
  COALESCE(SUM(
    CASE
      WHEN le.entry_type = 'charge' THEN le.amount
      WHEN le.entry_type = 'payment' THEN -le.amount
      ELSE le.amount
    END
  ), 0)::numeric(10,2) as total_balance_through_apr30,
  COALESCE(SUM(
    CASE WHEN le.entry_type = 'charge' THEN le.amount ELSE 0 END
  ), 0)::numeric(10,2) as total_charges_posted,
  COALESCE(SUM(
    CASE WHEN le.entry_type = 'payment' THEN le.amount ELSE 0 END
  ), 0)::numeric(10,2) as total_payments_received
FROM residents r
LEFT JOIN ledger_entries le ON le.resident_id = r.id
  AND le.entry_date < '2026-05-01'
WHERE r.status = 'Active';

-- QUERY 4: Check what happened on May 1st - what ledger entries were created/deleted
SELECT
  entry_date,
  entry_type,
  COUNT(*) as count,
  SUM(amount) as total_amount,
  STRING_AGG(DISTINCT description, '; ') as descriptions
FROM ledger_entries
WHERE entry_date >= '2026-05-01'
GROUP BY entry_date, entry_type
ORDER BY entry_date DESC, entry_type;

-- QUERY 5: Check resident status changes around May 1st
SELECT
  id,
  full_name,
  status,
  updated_at,
  payment_type,
  rent_amount
FROM residents
WHERE updated_at >= '2026-04-30'::timestamp
ORDER BY updated_at DESC;

-- QUERY 6: Detailed ledger for a specific resident (replace 'John Doe' with actual name)
SELECT
  le.entry_date,
  le.entry_type,
  le.amount,
  le.description,
  SUM(
    CASE
      WHEN le2.entry_type = 'charge' THEN le2.amount
      WHEN le2.entry_type = 'payment' THEN -le2.amount
      ELSE le2.amount
    END
  ) OVER (ORDER BY le.entry_date, le.created_at) as running_balance
FROM ledger_entries le
JOIN residents r ON r.id = le.resident_id
LEFT JOIN ledger_entries le2 ON le2.resident_id = le.resident_id
  AND (le2.entry_date < le.entry_date
       OR (le2.entry_date = le.entry_date AND le2.created_at <= le.created_at))
WHERE r.full_name = 'John Doe'  -- REPLACE WITH ACTUAL NAME
ORDER BY le.entry_date ASC, le.created_at ASC;

-- QUERY 7: Identify residents with potential data loss
-- (No rent due entries in April when they should have been charged)
SELECT
  r.full_name,
  r.status,
  r.payment_type,
  r.rent_amount,
  (SELECT COUNT(*)
   FROM ledger_entries le
   WHERE le.resident_id = r.id
     AND le.entry_date >= '2026-04-01'
     AND le.entry_date < '2026-05-01') as april_entries,
  (SELECT COUNT(*)
   FROM ledger_entries le
   WHERE le.resident_id = r.id
     AND le.entry_type = 'charge'
     AND le.description LIKE '%04/%'
     AND le.entry_date >= '2026-04-01'
     AND le.entry_date < '2026-05-01') as april_charges,
  (SELECT MAX(le.entry_date)
   FROM ledger_entries le
   WHERE le.resident_id = r.id) as last_transaction_ever
FROM residents r
WHERE r.status = 'Active'
  AND r.rent_amount IS NOT NULL
  AND r.payment_type IN ('Weekly', 'Monthly')
  AND (SELECT COUNT(*)
       FROM ledger_entries le
       WHERE le.resident_id = r.id
         AND le.entry_type = 'charge'
         AND le.description LIKE '%04/%'
         AND le.entry_date >= '2026-04-01'
         AND le.entry_date < '2026-05-01') = 0
ORDER BY r.full_name;
