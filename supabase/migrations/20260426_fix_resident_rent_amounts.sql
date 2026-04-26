-- Data correction: residents whose rent_amount was wrong, causing
-- post_scheduled_rent_charges() to auto-post incorrect amounts.
--
-- Steven Svoboda  Weekly  330.00 → 165.00 (true weekly rate, was double)
-- John Carr       Weekly  330.00 → 165.00 (same root cause as Steven)
-- Andrew Gaskill  Monthly 603.57 → 650.00 (initial-month proration was
--                                         saved as the recurring rate)
-- Josh Hanson     Monthly 335.48 → 650.00 (same proration mistake;
--                                         resident is Inactive so cron
--                                         currently skips, but fix the
--                                         row for accuracy if reactivated)
update public.residents
set rent_amount = 165.00,
    updated_at  = now()
where id in (
  '323b1b63-c8ed-4f29-b05f-f5030fd133cb',  -- Steven Svoboda
  '3f66eaff-d8a7-48fd-ab6f-846c34eea3a0'   -- John Carr
)
  and rent_amount = 330.00;

update public.residents
set rent_amount = 650.00,
    updated_at  = now()
where id = '066b362a-8a08-47ac-a765-bf152f326a81'  -- Andrew Gaskill
  and rent_amount = 603.57;

update public.residents
set rent_amount = 650.00,
    updated_at  = now()
where id = '8b87ab86-77cf-4e81-ad0e-3ea272ce70a4'  -- Josh Hanson
  and rent_amount = 335.48;
