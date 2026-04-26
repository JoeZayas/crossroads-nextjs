-- Capture the rent_amount column, post_scheduled_rent_charges() function,
-- and the auto-rent-charges cron job that were applied directly to the
-- production database (Supabase project tdsxvktekadesvobatzx) before this
-- repo had a migrations source of truth. Idempotent so it is safe to
-- re-apply against the existing prod database.

-- 1. residents.rent_amount: per-period rent (weekly amount for Weekly,
--    monthly amount for Monthly). Read by post_scheduled_rent_charges().
alter table public.residents
  add column if not exists rent_amount numeric;

-- 2. Function that posts the next rent charge for every Active resident
--    whose scheduled day has arrived. Inserted only if no equivalent
--    charge already exists for the period_start date.
create or replace function public.post_scheduled_rent_charges()
returns void
language plpgsql
as $function$
declare
  rec          record;
  today        date := current_date;
  period_start date;
  period_end   date;
  charge_desc  text;
begin
  for rec in
    select id, full_name, house_id, payment_type, rent_amount
    from residents
    where status = 'Active'
      and rent_amount is not null
      and (
        (payment_type = 'Monthly' and extract(day from today) = 1)
        or
        (payment_type = 'Weekly'  and extract(dow from today) = 1)
      )
  loop
    if rec.payment_type = 'Monthly' then
      period_start := today;
      period_end   := (today + interval '1 month - 1 day')::date;
      charge_desc  := 'Rent due ' || to_char(period_start, 'MM/DD/YYYY') ||
                      ' to '       || to_char(period_end,   'MM/DD/YYYY') ||
                      ' [auto-posted]';
    else
      period_start := today;
      period_end   := (today + interval '6 days')::date;
      charge_desc  := 'Rent due ' || to_char(period_start, 'MM/DD/YYYY') ||
                      ' to '       || to_char(period_end,   'MM/DD/YYYY') ||
                      ' [auto-posted]';
    end if;

    if not exists (
      select 1 from ledger_entries
      where resident_id = rec.id
        and entry_type  = 'charge'
        and entry_date  = period_start
        and description ilike '%Rent due%'
    ) then
      insert into ledger_entries
        (id, resident_id, house_id, entry_date, entry_type, description, amount)
      values
        (gen_random_uuid(), rec.id, rec.house_id, period_start,
         'charge', charge_desc, rec.rent_amount);
    end if;
  end loop;
end;
$function$;

-- 3. Daily cron job at 06:00 UTC. cron.schedule is upsert-by-name in
--    pg_cron 1.5+; the do-block makes it safe on older versions too.
create extension if not exists pg_cron;

do $$
begin
  if not exists (
    select 1 from cron.job where jobname = 'auto-rent-charges'
  ) then
    perform cron.schedule(
      'auto-rent-charges',
      '0 6 * * *',
      'SELECT public.post_scheduled_rent_charges();'
    );
  end if;
end
$$;
