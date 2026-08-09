# PaL,ve.Future Space Backend

## Supabase

- Project: `ktxhpqztorfzxkyeixcf`
- Public messages: `public.guestbook_messages`
- Anonymous behavior events: `public.site_events`
- Admin-only summaries: `private.analytics_daily`, `private.page_activity`
- Moderation queue: `private.guestbook_review_queue`

Both public tables have Row Level Security enabled. Anonymous visitors can only:

- Read guestbook rows whose `status` is `approved`.
- Insert guestbook rows whose `status` is `pending`.
- Insert constrained anonymous events.

Anonymous and authenticated browser roles cannot read behavior events or private views. Never add a service-role or secret key to the frontend.

## Moderating Messages

Open Supabase Table Editor, select `guestbook_messages`, and review rows with `status = pending`.

- Publish: set `status` to `approved` and `approved_at` to the current time.
- Hide: set `status` to `hidden`.

## Analytics

Use the SQL Editor with the private views:

```sql
select * from private.analytics_daily limit 30;
select * from private.page_activity limit 50;
select * from private.guestbook_review_queue;
```

Events contain pseudonymous visitor/session UUIDs, page paths, event names, and small metadata objects. Do not add form text, gallery answers, email addresses, IP addresses, or other sensitive values to event metadata.

## Deployment

Cloudflare Pages production and preview environments contain these public build variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

The values are public identifiers protected by RLS. Privileged credentials must remain server-side.
