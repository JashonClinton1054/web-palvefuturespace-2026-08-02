-- Parameterized admin-only aggregate for the 30-day raw-data window.

create or replace function public.admin_analytics_snapshot(
  p_from timestamptz,
  p_to timestamptz
)
returns jsonb
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  v_result jsonb;
begin
  if p_from is null or p_to is null or p_from >= p_to or p_to - p_from > interval '31 days' then
    raise exception using errcode = '22023', message = 'invalid date range';
  end if;

  select jsonb_build_object(
    'overview', jsonb_build_object(
      'page_views', count(*) filter (where event_name = 'page_view'),
      'visitors', count(distinct visitor_id),
      'sessions', count(distinct session_id),
      'events', count(*),
      'suspected_bots', count(*) filter (where suspected_bot),
      'gallery_attempts', count(*) filter (where event_name = 'gallery_gate_attempt'),
      'gallery_successes', count(*) filter (where event_name = 'gallery_gate_attempt' and metadata->>'result' = 'success')
    ),
    'daily', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.activity_day)
      from (
        select occurred_at::date as activity_day,
               count(*) filter (where event_name = 'page_view') page_views,
               count(distinct visitor_id) visitors,
               count(distinct session_id) sessions
        from public.edge_events
        where occurred_at >= p_from and occurred_at < p_to
        group by 1
      ) x
    ), '[]'::jsonb),
    'pages', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.page_views desc)
      from (
        select path, count(*) page_views, count(distinct visitor_id) visitors
        from public.edge_events
        where occurred_at >= p_from and occurred_at < p_to and event_name = 'page_view'
        group by path order by page_views desc limit 20
      ) x
    ), '[]'::jsonb),
    'geography', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.events desc)
      from (
        select coalesce(country_code, '未知') country_code, coalesce(region, '未知') region,
               coalesce(city, '未知') city, count(*) events, count(distinct visitor_id) visitors
        from public.edge_events
        where occurred_at >= p_from and occurred_at < p_to
        group by 1,2,3 order by events desc limit 30
      ) x
    ), '[]'::jsonb),
    'devices', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.events desc)
      from (
        select device_type, browser, os, count(*) events, count(distinct visitor_id) visitors
        from public.edge_events
        where occurred_at >= p_from and occurred_at < p_to
        group by 1,2,3 order by events desc limit 30
      ) x
    ), '[]'::jsonb),
    'referrers', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.events desc)
      from (
        select coalesce(nullif(referrer_host, ''), '直接访问') referrer_host,
               count(*) events, count(distinct visitor_id) visitors
        from public.edge_events
        where occurred_at >= p_from and occurred_at < p_to
        group by 1 order by events desc limit 20
      ) x
    ), '[]'::jsonb),
    'suspicious', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.request_count desc)
      from (
        select left(ip_hash, 10) || '…' fingerprint,
               max(country_code) country_code, max(city) city,
               count(*) request_count, count(*) filter (where suspected_bot) bot_events,
               min(occurred_at) first_seen_at, max(occurred_at) last_seen_at
        from public.edge_events
        where occurred_at >= p_from and occurred_at < p_to and ip_hash is not null
        group by ip_hash
        having count(*) >= 100 or bool_or(suspected_bot)
        order by request_count desc limit 30
      ) x
    ), '[]'::jsonb)
  ) into v_result
  from public.edge_events
  where occurred_at >= p_from and occurred_at < p_to;

  return coalesce(v_result, '{}'::jsonb);
end;
$$;

revoke execute on function public.admin_analytics_snapshot(timestamptz, timestamptz) from public, anon;
grant execute on function public.admin_analytics_snapshot(timestamptz, timestamptz) to authenticated;
