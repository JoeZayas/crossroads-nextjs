-- Reverse the over-charges already posted by post_scheduled_rent_charges()
-- before the rent_amount values were corrected. Each adjustment is the
-- delta between the bad $330 charge and the correct $165 weekly rate.
-- Guarded by NOT EXISTS so re-running this migration is a no-op.
--
-- Resident          Bad-charge date  Bad amount  Correct amount  Adjustment
-- Steven Svoboda    2026-04-13       330.00      165.00          -165.00
-- Steven Svoboda    2026-04-20       330.00      165.00          -165.00
-- John Carr         2026-04-20       330.00      165.00          -165.00
--
-- (John Carr's 2026-04-13 entry is a manual catch-up tagged
-- "[auto-posted current week]" at the correct $165, so no reversal.)

insert into public.ledger_entries
  (id, resident_id, house_id, entry_date, entry_type, description, amount)
select gen_random_uuid(),
       r.resident_id,
       (select house_id from public.residents where id = r.resident_id),
       r.entry_date,
       'adjustment',
       'Reversal: cron over-charge — rent_amount was $330, true weekly rate is $165',
       -165.00
from (values
  ('323b1b63-c8ed-4f29-b05f-f5030fd133cb'::uuid, date '2026-04-13'),
  ('323b1b63-c8ed-4f29-b05f-f5030fd133cb'::uuid, date '2026-04-20'),
  ('3f66eaff-d8a7-48fd-ab6f-846c34eea3a0'::uuid, date '2026-04-20')
) as r(resident_id, entry_date)
where not exists (
  select 1 from public.ledger_entries le
  where le.resident_id = r.resident_id
    and le.entry_date  = r.entry_date
    and le.entry_type  = 'adjustment'
    and le.description like 'Reversal: cron over-charge%'
);
