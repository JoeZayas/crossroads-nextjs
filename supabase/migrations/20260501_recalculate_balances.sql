-- Recalculate correct resident balances based on all ledger data prior to 2026-05-01
-- This migration calculates what each resident actually owes based on charges and payments
-- through April 30, 2026

-- Create a view showing the correct balances as of April 30, 2026
create or replace view public.v_balances_as_of_apr30_2026 as
select
  r.id as resident_id,
  r.full_name,
  r.house_id,
  h.name as house_name,
  r.status,
  r.payment_type,
  r.move_in_date,
  r.move_out_date,
  -- Sum all ledger entries before May 1, 2026
  coalesce(sum(
    case
      when le.entry_type = 'charge' then le.amount
      when le.entry_type = 'payment' then -le.amount
      else le.amount
    end
  ), 0)::numeric(10,2) as balance_as_of_apr30,
  -- Breakdown by type
  coalesce(sum(case when le.entry_type = 'charge' then le.amount else 0 end), 0)::numeric(10,2) as total_charges,
  coalesce(sum(case when le.entry_type = 'payment' then le.amount else 0 end), 0)::numeric(10,2) as total_payments,
  coalesce(sum(case when le.entry_type = 'adjustment' then le.amount else 0 end), 0)::numeric(10,2) as total_adjustments,
  -- Last transaction info
  max(le.entry_date) as last_transaction_date,
  count(le.id)::integer as transaction_count
from public.residents r
left join public.houses h on h.id = r.house_id
left join public.ledger_entries le on le.resident_id = r.id
  and le.entry_date < '2026-05-01'::date
group by r.id, r.full_name, r.house_id, h.name, r.status, r.payment_type, r.move_in_date, r.move_out_date;

-- Query to show who owes money (balance > 0)
create or replace view public.v_residents_owed_apr30 as
select
  resident_id,
  full_name,
  house_name,
  status,
  payment_type,
  balance_as_of_apr30 as amount_owed,
  total_charges,
  total_payments,
  last_transaction_date,
  transaction_count
from public.v_balances_as_of_apr30_2026
where balance_as_of_apr30 > 0
  and status = 'Active'
order by balance_as_of_apr30 desc;

grant select on public.v_balances_as_of_apr30_2026 to authenticated;
grant select on public.v_residents_owed_apr30 to authenticated;
