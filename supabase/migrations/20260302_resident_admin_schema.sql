-- Crossroads Sober Living resident management schema
-- Includes base tables, required views, RLS policies, and legacy import staging/merge.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.houses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  address text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.residents (
  id uuid primary key default gen_random_uuid(),
  house_id uuid references public.houses(id) on delete set null,
  full_name text not null,
  contract_signed_date date,
  move_in_date date,
  move_out_date date,
  payment_type text check (payment_type in ('Weekly', 'Monthly')),
  move_in_fee_due numeric(10,2) not null default 0,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_residents_full_name on public.residents (lower(full_name));
create index if not exists idx_residents_house_id on public.residents (house_id);
create index if not exists idx_residents_status on public.residents (status);

create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  resident_id uuid not null references public.residents(id) on delete cascade,
  house_id uuid references public.houses(id) on delete set null,
  entry_date date not null default current_date,
  entry_type text not null check (entry_type in ('charge', 'payment', 'adjustment')),
  description text not null,
  amount numeric(10,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_ledger_entries_resident_id on public.ledger_entries (resident_id);
create index if not exists idx_ledger_entries_entry_date on public.ledger_entries (entry_date);
create index if not exists idx_ledger_entries_entry_type on public.ledger_entries (entry_type);

drop trigger if exists set_houses_updated_at on public.houses;
create trigger set_houses_updated_at
before update on public.houses
for each row
execute function public.set_updated_at();

drop trigger if exists set_residents_updated_at on public.residents;
create trigger set_residents_updated_at
before update on public.residents
for each row
execute function public.set_updated_at();

drop trigger if exists set_ledger_entries_updated_at on public.ledger_entries;
create trigger set_ledger_entries_updated_at
before update on public.ledger_entries
for each row
execute function public.set_updated_at();

create or replace view public.v_resident_balances as
select
  r.id as resident_id,
  r.full_name,
  r.house_id,
  h.name as house_name,
  r.status,
  r.payment_type,
  r.move_in_date,
  r.move_out_date,
  coalesce(sum(le.amount), 0)::numeric(10,2) as balance
from public.residents r
left join public.houses h on h.id = r.house_id
left join public.ledger_entries le on le.resident_id = r.id
group by r.id, r.full_name, r.house_id, h.name, r.status, r.payment_type, r.move_in_date, r.move_out_date;

create or replace view public.v_last_payment as
select
  le.resident_id,
  max(le.entry_date) as last_payment_date,
  (
    array_agg(le.amount order by le.entry_date desc, le.created_at desc)
  )[1]::numeric(10,2) as last_payment_amount
from public.ledger_entries le
where le.entry_type = 'payment'
group by le.resident_id;

create or replace view public.v_overdue_residents as
select
  vb.resident_id,
  vb.full_name,
  vb.house_name,
  vb.balance,
  vlp.last_payment_date
from public.v_resident_balances vb
left join public.v_last_payment vlp on vlp.resident_id = vb.resident_id
where vb.status = 'Active'
  and vb.balance > 0;

create table if not exists public.ledger_import_staging (
  id bigserial primary key,
  full_name text not null,
  entry_date date,
  description text,
  amount numeric(10,2) not null,
  entry_type text not null check (entry_type in ('charge', 'payment', 'adjustment')),
  house_name text,
  source_row jsonb,
  processed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_ledger_import_staging_processed on public.ledger_import_staging (processed);
create index if not exists idx_ledger_import_staging_full_name on public.ledger_import_staging (lower(full_name));

create or replace function public.merge_ledger_import_staging()
returns integer
language plpgsql
security definer
as $$
declare
  inserted_count integer;
begin
  with matched as (
    select
      s.id as staging_id,
      r.id as resident_id,
      coalesce(r.house_id, h.id) as house_id,
      coalesce(s.entry_date, current_date) as entry_date,
      s.entry_type,
      coalesce(nullif(trim(s.description), ''), 'Imported legacy entry') as description,
      case
        when s.entry_type = 'charge' then abs(s.amount)
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

alter table public.houses enable row level security;
alter table public.residents enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.ledger_import_staging enable row level security;

drop policy if exists houses_authenticated_crud on public.houses;
create policy houses_authenticated_crud on public.houses
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists residents_authenticated_crud on public.residents;
create policy residents_authenticated_crud on public.residents
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists ledger_entries_authenticated_crud on public.ledger_entries;
create policy ledger_entries_authenticated_crud on public.ledger_entries
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists ledger_import_staging_authenticated_crud on public.ledger_import_staging;
create policy ledger_import_staging_authenticated_crud on public.ledger_import_staging
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

grant select on public.v_resident_balances to authenticated;
grant select on public.v_overdue_residents to authenticated;
grant select on public.v_last_payment to authenticated;
grant execute on function public.merge_ledger_import_staging() to authenticated;
