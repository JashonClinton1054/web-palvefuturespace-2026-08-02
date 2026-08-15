# PaL,ve.Future Space Backend

## Architecture

Browser events and guestbook submissions go to same-origin Cloudflare Pages Functions under `/api/*`. The edge function hashes the request IP with an HMAC secret, adds coarse Cloudflare location/device categories, signs the payload with ECDSA, and forwards it to the `palve-edge-gateway` Supabase Edge Function.

The browser never receives the IP, HMAC secret, signing key, Turnstile secret, or Supabase service-role key. It only contains the Supabase publishable key and Turnstile site key.

## Environment Variables

Public Vite build variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_TURNSTILE_SITE_KEY`

Cloudflare Pages encrypted secrets:

- `EDGE_SIGNING_PRIVATE_JWK`
- `IP_HASH_SECRET`
- `TURNSTILE_SECRET_KEY`

Optional server-side override:

- `SUPABASE_EDGE_GATEWAY_URL`

Never place encrypted secrets, a Supabase secret key, or the service-role key in `VITE_*`, `.env.example`, Git, or browser code.

## Admin And Moderation

Open `/admin` and sign in with an approved profile whose role is `admin`. The dashboard provides 1, 7, and 30-day aggregates, geography/device/referrer summaries, gallery verification rate, a masked anomaly list, moderation, and a CSV export without identifiers.

To publish a message, open **留言审核** and choose **公开**. Choose **隐藏** to remove it from the public archive. All status changes are recorded in `admin_audit_logs`.

As an emergency fallback, moderation can also be performed in the Supabase Table Editor on `public.guestbook_messages`.

## Data And Retention

- `public.edge_events`: pseudonymous event records. Raw rows are retained for 30 days.
- `public.analytics_rollups`: aggregate records retained after raw rows are removed.
- `public.guestbook_submission_log`: salted IP hash used for cooldown; removed after 24 hours.
- Existing login/security/session/audit exact IP and raw User-Agent values: cleared after 7 days.
- `cron.palve-analytics-retention`: runs daily at 03:15 Asia/Shanghai (19:15 UTC).

Cloudflare IP location is approximate. City may be unavailable or incorrect. Street addresses and precise individual tracking are not collected. GPC and DNT disable browser behavior-event submission; security processing and a user-initiated guestbook submission still require minimal request handling.

## Database Access Model

All exposed tables use RLS. Anonymous clients can only read approved guestbook display columns. They cannot directly insert guestbook messages or events, read analytics, call gateway functions, or access IP-related records. Edge ingestion uses a server-only service role after request-signature validation.

Schema changes live in `supabase/migrations`. Run Supabase Security and Performance Advisors after every database change.

The remaining Security Advisor warning is the dashboard-managed **Leaked Password Protection** setting. Enable it under Supabase **Authentication → Sign In / Security → Password security** when the project plan exposes that switch. It cannot be changed through the database migration API.

## Operational Checks

1. Open `/guestbook`, complete Turnstile, and confirm the message appears as `pending` in the admin queue.
2. Open several pages and confirm new `edge_events` arrive without raw IP or User-Agent fields.
3. Verify `/admin` rejects a normal or signed-out visitor.
4. Check response headers for CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, and no-store on `/api/*` and `/admin`.
5. Review Cloudflare Security Events, Pages Function logs, Supabase Edge Function logs, and Advisors.

Cloudflare Bot Fight Mode may also be enabled from **Security → Bots** if it is available for the zone. The management API rejected this setting for the current account, so it is intentionally not claimed as active; Turnstile, the managed WAF/DDoS rules, Browser Integrity Check, and the `/api/*` rate rule remain active.

## Incident Response

If traffic or submissions spike, first inspect Cloudflare Security Events and the dashboard anomaly table. Tighten the `/api/*` rate rule, rotate `IP_HASH_SECRET` if fingerprint privacy is in doubt, rotate the ECDSA pair if the edge signing key may be exposed, and rotate Supabase keys if a privileged key may be compromised. Revoke active administrator sessions, inspect `admin_audit_logs`, and hide suspicious guestbook content. Do not publish raw IPs in reports or issue discussions.
