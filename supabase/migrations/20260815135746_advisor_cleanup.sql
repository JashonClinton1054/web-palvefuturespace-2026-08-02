-- Resolve actionable Advisor findings and make deny-by-default intent explicit.

create index if not exists guestbook_submission_log_message_idx
on public.guestbook_submission_log (message_id);

drop policy if exists "Public can read approved guestbook messages" on public.guestbook_messages;
drop policy if exists guestbook_admin_read on public.guestbook_messages;

create policy guestbook_public_read on public.guestbook_messages
for select to anon
using (status = 'approved');

create policy guestbook_authenticated_read on public.guestbook_messages
for select to authenticated
using (status = 'approved' or (select private.is_admin((select auth.uid()))));

drop policy if exists site_events_deny_client on public.site_events;
create policy site_events_deny_client on public.site_events
for all to anon, authenticated using (false) with check (false);

drop policy if exists gateway_config_deny_client on private.gateway_config;
create policy gateway_config_deny_client on private.gateway_config
for all to anon, authenticated using (false) with check (false);

