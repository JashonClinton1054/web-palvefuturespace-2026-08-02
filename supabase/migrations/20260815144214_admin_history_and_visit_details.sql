-- Permanent aggregate history and privacy-preserving recent visit details.

create table if not exists public.analytics_daily_rollups (
  day date primary key,
  page_views bigint not null check (page_views >= 0),
  event_count bigint not null check (event_count >= 0),
  visitor_count bigint not null check (visitor_count >= 0),
  session_count bigint not null check (session_count >= 0),
  gallery_attempts bigint not null check (gallery_attempts >= 0),
  gallery_successes bigint not null check (gallery_successes >= 0),
  suspected_bot_count bigint not null check (suspected_bot_count >= 0)
);

create table if not exists public.analytics_dimension_rollups (
  day date not null,
  dimension varchar(16) not null check (dimension in ('page', 'geography', 'device', 'referrer')),
  value_1 varchar(256) not null default '',
  value_2 varchar(96) not null default '',
  value_3 varchar(96) not null default '',
  event_count bigint not null check (event_count >= 0),
  page_views bigint not null check (page_views >= 0),
  visitor_count bigint not null check (visitor_count >= 0),
  session_count bigint not null check (session_count >= 0),
  primary key (day, dimension, value_1, value_2, value_3)
);

create index if not exists analytics_dimension_rollups_dimension_day_idx
  on public.analytics_dimension_rollups (dimension, day desc);

alter table public.analytics_daily_rollups enable row level security;
alter table public.analytics_dimension_rollups enable row level security;

revoke all on table public.analytics_daily_rollups from public, anon, authenticated;
revoke all on table public.analytics_dimension_rollups from public, anon, authenticated;
grant select on table public.analytics_daily_rollups to authenticated;
grant select on table public.analytics_dimension_rollups to authenticated;

drop policy if exists analytics_daily_rollups_admin_read on public.analytics_daily_rollups;
create policy analytics_daily_rollups_admin_read on public.analytics_daily_rollups
for select to authenticated
using ((select private.is_admin((select auth.uid()))));

drop policy if exists analytics_dimension_rollups_admin_read on public.analytics_dimension_rollups;
create policy analytics_dimension_rollups_admin_read on public.analytics_dimension_rollups
for select to authenticated
using ((select private.is_admin((select auth.uid()))));

create or replace function private.rollup_and_prune_analytics()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.analytics_daily_rollups (
    day, page_views, event_count, visitor_count, session_count,
    gallery_attempts, gallery_successes, suspected_bot_count
  )
  select occurred_at::date,
         count(*) filter (where event_name = 'page_view'),
         count(*),
         count(distinct visitor_id),
         count(distinct session_id),
         count(*) filter (where event_name = 'gallery_gate_attempt'),
         count(*) filter (
           where event_name = 'gallery_gate_attempt' and metadata->>'result' = 'success'
         ),
         count(*) filter (where suspected_bot)
  from public.edge_events
  where occurred_at < current_date - 30
  group by 1
  on conflict (day) do update set
    page_views = excluded.page_views,
    event_count = excluded.event_count,
    visitor_count = excluded.visitor_count,
    session_count = excluded.session_count,
    gallery_attempts = excluded.gallery_attempts,
    gallery_successes = excluded.gallery_successes,
    suspected_bot_count = excluded.suspected_bot_count;

  insert into public.analytics_dimension_rollups (
    day, dimension, value_1, value_2, value_3,
    event_count, page_views, visitor_count, session_count
  )
  select rollup_day, dimension, value_1, value_2, value_3,
         event_count, page_views, visitor_count, session_count
  from (
    select occurred_at::date as rollup_day, 'page'::varchar(16) dimension,
           path::varchar(256) value_1, ''::varchar(96) value_2, ''::varchar(96) value_3,
           count(*)::bigint event_count,
           count(*)::bigint page_views,
           count(distinct visitor_id)::bigint visitor_count,
           count(distinct session_id)::bigint session_count
    from public.edge_events
    where occurred_at < current_date - 30 and event_name = 'page_view'
    group by 1, path

    union all

    select occurred_at::date as rollup_day, 'geography'::varchar(16),
           coalesce(country_code, '未知')::varchar(256),
           coalesce(region, '未知')::varchar(96),
           coalesce(city, '未知')::varchar(96),
           count(*)::bigint,
           count(*) filter (where event_name = 'page_view')::bigint,
           count(distinct visitor_id)::bigint,
           count(distinct session_id)::bigint
    from public.edge_events
    where occurred_at < current_date - 30
    group by 1, country_code, region, city

    union all

    select occurred_at::date as rollup_day, 'device'::varchar(16),
           device_type::varchar(256), browser::varchar(96), os::varchar(96),
           count(*)::bigint,
           count(*) filter (where event_name = 'page_view')::bigint,
           count(distinct visitor_id)::bigint,
           count(distinct session_id)::bigint
    from public.edge_events
    where occurred_at < current_date - 30
    group by 1, device_type, browser, os

    union all

    select occurred_at::date as rollup_day, 'referrer'::varchar(16),
           coalesce(nullif(referrer_host, ''), '直接访问')::varchar(256),
           ''::varchar(96), ''::varchar(96),
           count(*)::bigint,
           count(*) filter (where event_name = 'page_view')::bigint,
           count(distinct visitor_id)::bigint,
           count(distinct session_id)::bigint
    from public.edge_events
    where occurred_at < current_date - 30
    group by 1, referrer_host
  ) rollup_rows
  on conflict (day, dimension, value_1, value_2, value_3) do update set
    event_count = excluded.event_count,
    page_views = excluded.page_views,
    visitor_count = excluded.visitor_count,
    session_count = excluded.session_count;

  insert into public.analytics_rollups (
    day, event_name, event_label, path, referrer_host, country_code, region, city,
    device_type, browser, os, event_count, visitor_count, session_count, suspected_bot_count
  )
  select occurred_at::date, event_name, left(coalesce(metadata->>'result', ''), 64), path,
         coalesce(referrer_host, ''), coalesce(country_code, ''), coalesce(region, ''), coalesce(city, ''),
         device_type, browser, os, count(*), count(distinct visitor_id), count(distinct session_id),
         count(*) filter (where suspected_bot)
  from public.edge_events
  where occurred_at < current_date - 30
  group by 1,2,3,4,5,6,7,8,9,10,11
  on conflict (day, event_name, event_label, path, referrer_host, country_code, region, city, device_type, browser, os)
  do update set
    event_count = excluded.event_count,
    visitor_count = excluded.visitor_count,
    session_count = excluded.session_count,
    suspected_bot_count = excluded.suspected_bot_count;

  delete from public.edge_events where occurred_at < current_date - 30;
  delete from public.guestbook_submission_log where created_at < now() - interval '24 hours';

  update public.login_events set ip_address = null, user_agent = null
  where created_at < now() - interval '7 days' and (ip_address is not null or user_agent is not null);
  update public.security_events set ip_address = null
  where created_at < now() - interval '7 days' and ip_address is not null;
  update public.user_sessions set ip_address = null, user_agent = null
  where last_seen_at < now() - interval '7 days' and (ip_address is not null or user_agent is not null);
  update public.admin_audit_logs set ip_address = null
  where created_at < now() - interval '7 days' and ip_address is not null;
  update public.profiles set registration_ip = null
  where created_at < now() - interval '7 days' and registration_ip is not null;

  delete from cron.job_run_details where end_time < now() - interval '30 days';
end;
$$;

revoke execute on function private.rollup_and_prune_analytics() from public, anon, authenticated;

create or replace function public.admin_analytics_history_snapshot(
  p_from date default null,
  p_to date default (current_date + 1)
)
returns jsonb
language plpgsql
stable
set search_path = ''
as $$
declare
  v_from date := coalesce(p_from, '1970-01-01'::date);
  v_result jsonb;
begin
  if p_to is null or v_from >= p_to or p_to > current_date + 2 then
    raise exception using errcode = '22023', message = 'invalid date range';
  end if;

  with
  raw_daily as (
    select occurred_at::date activity_day,
           count(*) filter (where event_name = 'page_view')::bigint page_views,
           count(*)::bigint events,
           count(distinct visitor_id)::bigint visitors,
           count(distinct session_id)::bigint sessions,
           count(*) filter (where event_name = 'gallery_gate_attempt')::bigint gallery_attempts,
           count(*) filter (
             where event_name = 'gallery_gate_attempt' and metadata->>'result' = 'success'
           )::bigint gallery_successes,
           count(*) filter (where suspected_bot)::bigint suspected_bots
    from public.edge_events
    where occurred_at >= v_from::timestamptz and occurred_at < p_to::timestamptz
    group by 1
  ),
  combined_daily as (
    select * from raw_daily
    union all
    select day, page_views, event_count, visitor_count, session_count,
           gallery_attempts, gallery_successes, suspected_bot_count
    from public.analytics_daily_rollups
    where day >= v_from and day < p_to
  ),
  raw_pages as (
    select path value_1, count(*)::bigint events, count(*)::bigint page_views,
           count(distinct visitor_id)::bigint visitors
    from public.edge_events
    where occurred_at >= v_from::timestamptz and occurred_at < p_to::timestamptz
      and event_name = 'page_view'
    group by path
  ),
  combined_pages as (
    select value_1, events, page_views, visitors from raw_pages
    union all
    select value_1, sum(event_count), sum(page_views), sum(visitor_count)
    from public.analytics_dimension_rollups
    where dimension = 'page' and day >= v_from and day < p_to
    group by value_1
  ),
  raw_geo as (
    select coalesce(country_code, '未知') value_1,
           coalesce(region, '未知') value_2,
           coalesce(city, '未知') value_3,
           count(*)::bigint events, count(distinct visitor_id)::bigint visitors
    from public.edge_events
    where occurred_at >= v_from::timestamptz and occurred_at < p_to::timestamptz
    group by 1,2,3
  ),
  combined_geo as (
    select value_1, value_2, value_3, events, visitors from raw_geo
    union all
    select value_1, value_2, value_3, sum(event_count), sum(visitor_count)
    from public.analytics_dimension_rollups
    where dimension = 'geography' and day >= v_from and day < p_to
    group by value_1, value_2, value_3
  ),
  raw_devices as (
    select device_type value_1, browser value_2, os value_3,
           count(*)::bigint events, count(distinct visitor_id)::bigint visitors
    from public.edge_events
    where occurred_at >= v_from::timestamptz and occurred_at < p_to::timestamptz
    group by 1,2,3
  ),
  combined_devices as (
    select value_1, value_2, value_3, events, visitors from raw_devices
    union all
    select value_1, value_2, value_3, sum(event_count), sum(visitor_count)
    from public.analytics_dimension_rollups
    where dimension = 'device' and day >= v_from and day < p_to
    group by value_1, value_2, value_3
  ),
  raw_referrers as (
    select coalesce(nullif(referrer_host, ''), '直接访问') value_1,
           count(*)::bigint events, count(distinct visitor_id)::bigint visitors
    from public.edge_events
    where occurred_at >= v_from::timestamptz and occurred_at < p_to::timestamptz
    group by 1
  ),
  combined_referrers as (
    select value_1, events, visitors from raw_referrers
    union all
    select value_1, sum(event_count), sum(visitor_count)
    from public.analytics_dimension_rollups
    where dimension = 'referrer' and day >= v_from and day < p_to
    group by value_1
  )
  select jsonb_build_object(
    'overview', coalesce((
      select jsonb_build_object(
        'page_views', coalesce(sum(page_views), 0),
        'visitors', coalesce(sum(visitors), 0),
        'sessions', coalesce(sum(sessions), 0),
        'events', coalesce(sum(events), 0),
        'suspected_bots', coalesce(sum(suspected_bots), 0),
        'gallery_attempts', coalesce(sum(gallery_attempts), 0),
        'gallery_successes', coalesce(sum(gallery_successes), 0)
      ) from combined_daily
    ), '{}'::jsonb),
    'daily', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.activity_day)
      from (
        select activity_day, sum(page_views)::bigint page_views,
               sum(visitors)::bigint visitors, sum(sessions)::bigint sessions
        from combined_daily group by activity_day order by activity_day
      ) x
    ), '[]'::jsonb),
    'pages', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.page_views desc)
      from (
        select value_1 path, sum(page_views)::bigint page_views, sum(visitors)::bigint visitors
        from combined_pages group by value_1 order by page_views desc limit 20
      ) x
    ), '[]'::jsonb),
    'geography', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.events desc)
      from (
        select value_1 country_code, value_2 region, value_3 city,
               sum(events)::bigint events, sum(visitors)::bigint visitors
        from combined_geo group by value_1, value_2, value_3 order by events desc limit 30
      ) x
    ), '[]'::jsonb),
    'devices', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.events desc)
      from (
        select value_1 device_type, value_2 browser, value_3 os,
               sum(events)::bigint events, sum(visitors)::bigint visitors
        from combined_devices group by value_1, value_2, value_3 order by events desc limit 30
      ) x
    ), '[]'::jsonb),
    'referrers', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.events desc)
      from (
        select value_1 referrer_host, sum(events)::bigint events, sum(visitors)::bigint visitors
        from combined_referrers group by value_1 order by events desc limit 20
      ) x
    ), '[]'::jsonb),
    'suspicious', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.request_count desc)
      from (
        select left(ip_hash, 10) || '…' fingerprint,
               max(country_code) country_code, max(city) city,
               count(*)::bigint request_count,
               count(*) filter (where suspected_bot)::bigint bot_events,
               min(occurred_at) first_seen_at, max(occurred_at) last_seen_at
        from public.edge_events
        where occurred_at >= greatest(v_from::timestamptz, now() - interval '30 days')
          and occurred_at < p_to::timestamptz and ip_hash is not null
        group by ip_hash
        having count(*) >= 100 or bool_or(suspected_bot)
        order by request_count desc limit 30
      ) x
    ), '[]'::jsonb),
    'retention', jsonb_build_object(
      'raw_days', 30,
      'aggregates', 'permanent',
      'range_is_daily_unique_sum', true
    )
  ) into v_result;

  return coalesce(v_result, '{}'::jsonb);
end;
$$;

revoke execute on function public.admin_analytics_history_snapshot(date, date) from public, anon;
grant execute on function public.admin_analytics_history_snapshot(date, date) to authenticated;

create or replace function public.admin_recent_visits(
  p_from timestamptz default (now() - interval '30 days'),
  p_to timestamptz default now(),
  p_limit integer default 200
)
returns table (
  occurred_at timestamptz,
  fingerprint text,
  event_name text,
  event_result text,
  path text,
  country_code text,
  region text,
  city text,
  timezone text,
  network text,
  device_type text,
  browser text,
  os text,
  referrer_host text,
  suspected_bot boolean
)
language plpgsql
stable
set search_path = ''
as $$
begin
  if p_from is null or p_to is null or p_from >= p_to
     or p_to - p_from > interval '31 days' or p_limit < 1 or p_limit > 500 then
    raise exception using errcode = '22023', message = 'invalid visit detail request';
  end if;

  return query
  select e.occurred_at,
         case when e.ip_hash is null then '未记录' else left(e.ip_hash, 10) || '…' end,
         e.event_name::text,
         left(coalesce(e.metadata->>'result', ''), 32),
         e.path::text,
         coalesce(e.country_code, '未知')::text,
         coalesce(e.region, '未知')::text,
         coalesce(e.city, '未知')::text,
         coalesce(e.timezone, '未知')::text,
         case when e.asn is null then '未知' else 'AS' || e.asn::text end,
         e.device_type::text,
         e.browser::text,
         e.os::text,
         coalesce(nullif(e.referrer_host, ''), '直接访问')::text,
         e.suspected_bot
  from public.edge_events e
  where e.occurred_at >= p_from and e.occurred_at < p_to
  order by e.occurred_at desc
  limit p_limit;
end;
$$;

revoke execute on function public.admin_recent_visits(timestamptz, timestamptz, integer) from public, anon;
grant execute on function public.admin_recent_visits(timestamptz, timestamptz, integer) to authenticated;
