begin;

insert into public.houses (name, address, is_active)
values ('22nd St. SE', '836 22nd St. SE', true)
on conflict (name) do update set address = excluded.address, is_active = true;

with current_residents as (
  select * from (values
    (1, 'Jeremy Kirkham', 'Weekly', 200, 200, 0, 'Yes', 60),
    (2, 'Steven Svoboda', 'Weekly', 200, 200, 0, 'Yes', 0),
    (3, 'Greg', 'Monthly', 200, 200, 0, 'Yes', 0),
    (4, 'John Carr', 'Weekly', 200, 200, 0, 'Yes', 0),
    (5, 'Rick Shangle', 'Weekly', 200, 200, 0, 'Yes', 0),
    (6, 'Josh Hanson', 'Monthly', 200, 200, 0, 'Yes', 0),
    (7, 'Andrew Gaskill', 'Monthly', 200, 200, 0, 'Yes', 0),
    (8, 'Jesse', 'Weekly', 200, 50, 150, 'No', 0)
  ) as t(slot, full_name, payment_type, move_in_fee_due, move_in_fee_paid, fee_balance, active_yes_no, rent_owed)
),
payments as (
  select * from (values
    (NULL, 'Jeremy Kirkham', 'Weekly', 'Other', '12/15/2025', '12/21/2025', 165, 0, 165, 'Due', '2025-12', NULL),
    ('12/21/2025', 'Jeremy Kirkham', 'Weekly', 'Cash', '12/22/2025', '12/28/2025', 165, 200, -35, 'Paid', '2025-12', NULL),
    ('12/29/2025', 'Jeremy Kirkham', 'Weekly', 'Cash', '12/29/2025', '1/4/2026', 165, 200, -35, 'Paid', '2025-12', NULL),
    ('12/29/2025', 'John Carr', 'Weekly', 'Venmo', '12/29/2025', '1/4/2026', 165, 165, 0, 'Paid', '2025-12', NULL),
    ('1/5/2026', 'Jeremy Kirkham', 'Weekly', 'Cash', '1/5/2026', '1/11/2026', 165, 200, -35, 'Paid', '2026-01', NULL),
    ('1/11/2026', 'Jeremy Kirkham', 'Weekly', 'Cash', '1/12/2026', '1/18/2026', 165, 140, 25, 'Due', '2026-01', NULL),
    ('12/3/2025', 'Greg', 'Monthly', 'Cash', '12/1/2025', '12/31/2025', 650, 650, 0, 'Paid', '2025-12', NULL),
    ('1/3/2026', 'Greg', 'Monthly', 'Cash', '1/1/2026', '1/31/2026', 650, 700, -50, 'Paid', '2026-01', NULL),
    ('1/10/2026', 'Steven Svoboda', 'Weekly', 'Other', '1/5/2026', '1/11/2026', 165, 165, 0, 'Paid', '2026-01', NULL),
    ('1/12/2026', 'Steven Svoboda', 'Weekly', 'Cash', '1/12/2026', '1/18/2026', 165, 165, 0, 'Paid', '2026-01', NULL),
    ('1/16/2026', 'Josh Hanson', 'Monthly', 'Other', '1/16/2026', '1/31/2026', 335.48, 335.48, 0, 'Paid', '2026-01', NULL),
    ('1/16/2026', 'Steven Svoboda', 'Weekly', 'Other', '1/12/2026', '1/18/2026', 165, 165, 0, 'Paid', '2026-01', NULL),
    ('1/19/2026', 'Steven Svoboda', 'Weekly', 'Cash', '1/19/2026', '1/25/2026', 165, 165, 0, 'Paid', '2026-01', NULL),
    ('1/15/2026', 'John Carr', 'Weekly', 'Venmo', '1/5/2026', '1/11/2026', 165, 165, 0, 'Paid', '2026-01', NULL),
    ('1/19/2026', 'John Carr', 'Weekly', 'Venmo', '1/19/2026', '1/25/2026', 165, 165, 0, 'Paid', '2026-01', NULL),
    ('1/26/2026', 'John Carr', 'Weekly', 'Venmo', '1/26/2026', '2/1/2026', 165, 165, 0, 'Paid', '2026-01', NULL),
    ('1/28/2026', 'Jeremy Kirkham', 'Weekly', 'Cash', '1/26/2026', '2/1/2026', 165, 200, -35, 'Paid', '2026-01', NULL),
    ('1/28/2026', 'Steven Svoboda', 'Weekly', 'Cash', '1/26/2026', '2/1/2026', 165, 165, 0, 'Paid', '2026-01', NULL),
    ('1/19/2026', 'Jeremy Kirkham', 'Weekly', 'Cash', '1/19/2026', '1/25/2026', 165, 200, -35, 'Paid', '2026-01', NULL),
    ('2/3/2026', 'Andrew Gaskill', 'Monthly', 'Other', '2/3/2026', '2/28/2026', 603.57, 563.57, 40, 'Due', '2026-02', 'Accidentally sugned invoice without conforming numbers.'),
    ('2/2/2026', 'Jeremy Kirkham', 'Weekly', 'Cash', '2/2/2026', '2/8/2026', 165, 90, 75, 'Due', '2026-02', NULL),
    ('2/2/2026', 'John Carr', 'Weekly', 'Venmo', '2/2/2026', '2/8/2026', 165, 165, 0, 'Paid', '2026-02', NULL),
    ('2/1/2026', 'Greg', 'Monthly', 'Cash', '2/1/2026', '2/28/2026', 650, 650, 0, 'Paid', '2026-02', NULL),
    ('2/10/2026', 'Jeremy Kirkham', 'Weekly', 'Cash', '2/9/2026', '2/15/2026', 165, 160, 5, 'Due', '2026-02', NULL),
    ('2/10/2026', 'John Carr', 'Weekly', 'Cash', '2/9/2026', '2/15/2026', 165, 165, 0, 'Paid', '2026-02', NULL),
    ('2/10/2026', 'Steven Svoboda', 'Weekly', 'Other', '2/2/2026', '2/15/2026', 330, 330, 0, 'Paid', '2026-02', NULL),
    ('2/17/2026', 'Jeremy Kirkham', 'Weekly', 'Cash', '2/16/2026', '2/22/2026', 165, 200, -35, 'Paid', '2026-02', NULL),
    ('2/17/2026', 'Jesse', 'Weekly', 'Cash', '2/16/2026', '2/22/2026', 165, 165, 0, 'Paid', '2026-02', NULL),
    ('2/23/2026', 'Steven Svoboda', 'Weekly', 'Cash', '2/9/2026', '2/22/2026', 330, 330, 0, 'Paid', '2026-02', NULL),
    ('2/24/2026', 'Jeremy Kirkham', 'Weekly', 'Cash', '2/16/2026', '2/22/2026', 165, 165, 0, 'Paid', '2026-02', NULL),
    ('2/16/2026', 'John Carr', 'Weekly', 'Venmo', '2/16/2026', '3/1/2026', 330, 165, 165, 'Due', '2026-02', NULL)
  ) as t(date_paid_text, full_name, payment_type, payment_method, period_start_text, period_end_text, amount_due, amount_paid, balance_auto, status_auto, month_yyyy_mm, notes)
),
house_ref as (
  select id from public.houses where name = '22nd St. SE' limit 1
),
source_residents as (
  select distinct
    trim(full_name) as full_name,
    payment_type,
    move_in_fee_due,
    move_in_fee_paid,
    fee_balance,
    active_yes_no,
    rent_owed
  from current_residents
  union
  select distinct
    trim(full_name) as full_name,
    payment_type,
    0::numeric as move_in_fee_due,
    0::numeric as move_in_fee_paid,
    0::numeric as fee_balance,
    'Yes'::text as active_yes_no,
    0::numeric as rent_owed
  from payments
),
ins_residents as (
  insert into public.residents (house_id, full_name, payment_type, move_in_fee_due, status, notes)
  select
    h.id,
    s.full_name,
    s.payment_type,
    coalesce(s.move_in_fee_due, 0),
    case when coalesce(s.active_yes_no, 'Yes') = 'Yes' then 'Active' else 'Inactive' end,
    'Imported from Crossroads CSV bundle (2026-03-01)'
  from source_residents s
  cross join house_ref h
  where s.full_name <> ''
    and not exists (
      select 1 from public.residents r where lower(trim(r.full_name)) = lower(trim(s.full_name))
    )
  returning id, full_name
),
upd_residents as (
  update public.residents r
  set
    house_id = h.id,
    payment_type = coalesce(cr.payment_type, r.payment_type),
    move_in_fee_due = coalesce(cr.move_in_fee_due, r.move_in_fee_due),
    status = case when coalesce(cr.active_yes_no, 'Yes') = 'Yes' then 'Active' else 'Inactive' end
  from current_residents cr
  cross join house_ref h
  where lower(trim(r.full_name)) = lower(trim(cr.full_name))
  returning r.id
),
all_residents as (
  select id, full_name, house_id from public.residents
  where lower(trim(full_name)) in (select lower(trim(full_name)) from source_residents)
),
ins_fee_due as (
  insert into public.ledger_entries (resident_id, house_id, entry_date, entry_type, description, amount)
  select
    r.id, coalesce(r.house_id, h.id), current_date, 'charge',
    'CSV import: move-in fee due', abs(coalesce(cr.move_in_fee_due, 0))
  from current_residents cr
  join all_residents r on lower(trim(r.full_name)) = lower(trim(cr.full_name))
  cross join house_ref h
  where coalesce(cr.move_in_fee_due, 0) > 0
    and not exists (
      select 1 from public.ledger_entries le
      where le.resident_id = r.id and le.description = 'CSV import: move-in fee due'
    )
  returning id
),
ins_fee_paid as (
  insert into public.ledger_entries (resident_id, house_id, entry_date, entry_type, description, amount)
  select
    r.id, coalesce(r.house_id, h.id), current_date, 'payment',
    'CSV import: move-in fee paid', -abs(coalesce(cr.move_in_fee_paid, 0))
  from current_residents cr
  join all_residents r on lower(trim(r.full_name)) = lower(trim(cr.full_name))
  cross join house_ref h
  where coalesce(cr.move_in_fee_paid, 0) > 0
    and not exists (
      select 1 from public.ledger_entries le
      where le.resident_id = r.id and le.description = 'CSV import: move-in fee paid'
    )
  returning id
),
ins_rent_due as (
  insert into public.ledger_entries (resident_id, house_id, entry_date, entry_type, description, amount)
  select
    r.id, coalesce(r.house_id, h.id),
    to_date(p.period_start_text, 'MM/DD/YYYY'),
    'charge',
    ('Rent due ' || p.period_start_text || ' to ' || p.period_end_text || coalesce(' [' || p.payment_method || ']', '')) as description,
    abs(coalesce(p.amount_due, 0))
  from payments p
  join all_residents r on lower(trim(r.full_name)) = lower(trim(p.full_name))
  cross join house_ref h
  where coalesce(p.amount_due, 0) > 0
    and p.period_start_text is not null
    and not exists (
      select 1 from public.ledger_entries le
      where le.resident_id = r.id
        and le.entry_type = 'charge'
        and le.description = ('Rent due ' || p.period_start_text || ' to ' || p.period_end_text || coalesce(' [' || p.payment_method || ']', ''))
        and le.amount = abs(coalesce(p.amount_due, 0))
    )
  returning id
),
ins_rent_paid as (
  insert into public.ledger_entries (resident_id, house_id, entry_date, entry_type, description, amount)
  select
    r.id, coalesce(r.house_id, h.id),
    coalesce(to_date(p.date_paid_text, 'MM/DD/YYYY'), to_date(p.period_end_text, 'MM/DD/YYYY'), current_date),
    'payment',
    ('Rent payment ' || p.period_start_text || ' to ' || p.period_end_text || coalesce(' via ' || p.payment_method, '') || case when p.notes is not null then ' | ' || p.notes else '' end) as description,
    -abs(coalesce(p.amount_paid, 0))
  from payments p
  join all_residents r on lower(trim(r.full_name)) = lower(trim(p.full_name))
  cross join house_ref h
  where coalesce(p.amount_paid, 0) > 0
    and not exists (
      select 1 from public.ledger_entries le
      where le.resident_id = r.id
        and le.entry_type = 'payment'
        and le.description = ('Rent payment ' || p.period_start_text || ' to ' || p.period_end_text || coalesce(' via ' || p.payment_method, '') || case when p.notes is not null then ' | ' || p.notes else '' end)
        and le.amount = -abs(coalesce(p.amount_paid, 0))
    )
  returning id
)
select 'ok' as import_status;

commit;

-- Validation
select full_name, status, payment_type, balance from public.v_resident_balances order by full_name;
