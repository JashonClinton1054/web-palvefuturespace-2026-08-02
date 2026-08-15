-- Align the edge-only submission function with the existing public channel set.

drop policy if exists profiles_update_own on public.profiles;
revoke update on table public.profiles from anon, authenticated;

create or replace function public.edge_submit_guestbook(
  p_request_id uuid,
  p_visitor_id uuid,
  p_display_name text,
  p_channel text,
  p_message text,
  p_ip_hash text,
  p_country_code text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_message_id uuid;
begin
  if p_display_name is null or length(btrim(p_display_name)) not between 1 and 24 then
    raise exception using errcode = '22023', message = 'invalid display name';
  end if;
  if p_message is null or length(btrim(p_message)) not between 1 and 180 then
    raise exception using errcode = '22023', message = 'invalid message';
  end if;
  if p_channel not in ('问候', '灵感', '雨夜') then
    raise exception using errcode = '22023', message = 'invalid channel';
  end if;
  if p_ip_hash is null or p_ip_hash !~ '^[0-9a-f]{64}$' then
    raise exception using errcode = '22023', message = 'invalid request fingerprint';
  end if;

  select message_id into v_message_id
  from public.guestbook_submission_log where request_id = p_request_id;
  if v_message_id is not null then return v_message_id; end if;

  if exists (
    select 1 from public.guestbook_submission_log
    where ip_hash = p_ip_hash and created_at > now() - interval '90 seconds'
  ) then
    raise exception using errcode = 'P0001', message = 'cooldown';
  end if;

  insert into public.guestbook_messages(visitor_id, display_name, channel, message, status, likes)
  values (p_visitor_id, btrim(p_display_name), p_channel, btrim(p_message), 'pending', 0)
  returning id into v_message_id;

  insert into public.guestbook_submission_log(request_id, message_id, ip_hash, country_code)
  values (p_request_id, v_message_id, p_ip_hash, nullif(upper(p_country_code), ''));
  return v_message_id;
end;
$$;

revoke execute on function public.edge_submit_guestbook(uuid, uuid, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.edge_submit_guestbook(uuid, uuid, text, text, text, text, text) to service_role;

