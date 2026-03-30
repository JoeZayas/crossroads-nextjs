-- Ledger integrity fixes
-- Fix 1: Add unique constraint on ledger_entries to prevent duplicate submissions.
-- Fix 2: Add ledger_import_rejections table and update merge_ledger_import_staging()
--         to log unmatched staging rows instead of silently dropping them.

-- Fix 1: Unique index to block double-click / duplicate imports
create unique index if not exists uq_ledger_entries_dedup
  on public.ledger_entries (resident_id, entry_date, entry_type, amount, description);

-- Fix 2a: Rejection log table for staging rows that cannot be matched to a resident
create table if not exists public.ledger_import_rejections (
  id          bigserial   primary key,
  staging_id  bigint      not null references public.ledger_import_staging(id) on delete cascade,
  full_name   text        not null,
  entry_date  date,
  entry_type  text        not null,
  amount      numeric(10,2) not null,
  description text,
  house_name  text,
  source_row  jsonb,
  reason      text        not null default 'No matching resident found',
  created_at  timestamptz not null default now()
);

create index if not exists idx_ledger_import_rejections_staging_id
  on public.ledger_import_rejections (staging_id);

alter table public.ledger_import_rejections enable row level security;

drop policy if exists ledger_import_rejections_authenticated_crud on public.ledger_import_rejections;
create policy ledger_import_rejections_authenticated_crud on public.ledger_import_rejections
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

grant select on public.ledger_import_rejections to authenticated;

-- Fix 2b: Replace merge function — use LEFT JOIN, log unmatched rows into rejections table
create or replace function public.merge_ledger_import_staging()
returns integer
language plpgsql
security definer
as $$
declare
  inserted_count integer;
begin
  -- Log unmatched staging rows (no resident name match) into the rejections table.
  insert into public.ledger_import_rejections (
    staging_id,
    full_name,
    entry_date,
    entry_type,
    amount,
    description,
    house_name,
    source_row,
    reason
  )
  select
    s.id,
    s.full_name,
    s.entry_date,
    s.entry_type,
    s.amount,
    s.description,
    s.house_name,
    s.source_row,
    'No matching resident found for name: ' || s.full_name
  from public.ledger_import_staging s
  left join public.residents r
    on lower(trim(r.full_name)) = lower(trim(s.full_name))
  where s.processed = false
    and r.id is null;

  -- Insert matched rows into ledger_entries and mark staging rows as processed.
  with matched as (
    select
      s.id as staging_id,
      r.id as resident_id,
      coalesce(r.house_id, h.id) as house_id,
      coalesce(s.entry_date, current_date) as entry_date,
      s.entry_type,
      coalesce(nullif(trim(s.description), ''), 'Imported legacy entry') as description,
      case
        when s.entry_type = 'charge'  then  abs(s.amount)
        when s.entry_type = 'payment' then -abs(s.amount)
        else s.amount
      end as normalized_amount
    from public.ledger_import_staging s
    join public.residents r
      on lower(trim(r.full_name)) = lower(trim(s.full_name))
    left join public.houses h
      on lower(trim(h.name)) = lower(trim(s.house_name))
    where s.processed = false
  ),
  inserted as (
    insert into public.ledger_entries (
      resident_id,
      house_id,
      entry_date,
      entry_type,
      description,
      amount
    )
    select
      resident_id,
      house_id,
      entry_date,
      entry_type,
      description,
      normalized_amount
    from matched
    returning resident_id
  )
  update public.ledger_import_staging s
  set processed = true
  where s.id in (select staging_id from matched);

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;
