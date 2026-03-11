# Crossroads Admin Setup

## CSV analysis (latest download)
File analyzed: `/Users/joezayas2/Downloads/Copy of Crossroads_Rent_Tracker_SIMPLE - Current Residents.csv`

Headers:
- `Slot`
- `Resident Name`
- `Contract Signed Date`
- `Move-In Date`
- `Payment Type (Weekly/Monthly)`
- `Move-In Fee Due`
- `Move-In Fee Paid`
- `Fee Paid Date`
- `Fee Balance`
- `Active (Yes/No)`
- `Rent Owed`
- `Contract Signed`
- `Fee Paid Checkbox`
- `Calculated Fee Balance`

## 1) Supabase SQL migration
Run:
- `supabase/migrations/20260302_resident_admin_schema.sql`

This creates:
- Tables: `houses`, `residents`, `ledger_entries`, `ledger_import_staging`
- Views: `v_resident_balances`, `v_overdue_residents`, `v_last_payment`
- Function: `merge_ledger_import_staging()`
- RLS policies: authenticated users can CRUD for MVP

## 2) Env vars
Set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 3) Access app
- Login page: `/admin/login`
- Admin root: `/admin`

## 4) Legacy sheet import path
The app uses `ledger_import_staging` and merges by resident `full_name`.

### Example: convert the tracked CSV into staging rows
Use this in Supabase SQL editor (after loading raw sheet rows into a temp table or manual insert):

```sql
-- Example source table shape from Google Sheet export:
-- legacy_sheet_raw(resident_name text, active_yes_no text, rent_owed numeric, fee_balance numeric)

insert into public.ledger_import_staging (full_name, entry_date, description, amount, entry_type, source_row)
select
  trim(resident_name) as full_name,
  current_date as entry_date,
  'Legacy rent owed import' as description,
  rent_owed as amount,
  'charge' as entry_type,
  to_jsonb(legacy_sheet_raw.*) as source_row
from legacy_sheet_raw
where coalesce(rent_owed, 0) > 0

union all

select
  trim(resident_name) as full_name,
  current_date as entry_date,
  'Legacy move-in fee balance import' as description,
  fee_balance as amount,
  'charge' as entry_type,
  to_jsonb(legacy_sheet_raw.*) as source_row
from legacy_sheet_raw
where coalesce(fee_balance, 0) > 0;

select public.merge_ledger_import_staging();
```

Notes:
- `charge` entries are normalized to positive amounts.
- `payment` entries are normalized to negative amounts.
- Merge is based on case-insensitive trimmed resident `full_name`.
