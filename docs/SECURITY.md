# Security Baseline

This site uses layered controls; none of them make it impossible to attack.

- Cloudflare: HTTPS, TLS 1.2+, HSTS, managed WAF/DDoS protection, Browser Integrity Check, Turnstile, and rate limiting.
- Browser: restrictive CSP, clickjacking protection, MIME sniffing protection, privacy-focused permissions policy, same-origin API calls, and output escaping through React.
- Edge: strict content type/body size/origin checks, field allowlists, server-side Turnstile verification, HMAC IP pseudonymization, and ECDSA request signing.
- Supabase: RLS on exposed tables, service role only in an Edge Function, constrained fields, admin authorization from database state, audit logs, and retention jobs.
- Supply chain: lockfile committed, production build and dependency audit required before deployment.

The gallery questions are a personal interaction gate, not an authentication boundary. Do not store sensitive files behind that gate or rely on frontend code to keep a secret.

Review this baseline after material feature changes and after Cloudflare or Supabase security advisories.
