const MAX_BODY_BYTES = 4096;
const EVENT_NAME = /^[a-z][a-z0-9_]{1,47}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CHANNELS = new Set(["问候", "灵感", "雨夜"]);
const METADATA_KEYS = new Set([
  "action",
  "channel",
  "device",
  "duration_seconds",
  "language",
  "length",
  "message_id",
  "reduced_motion",
  "result",
  "title",
]);

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  },
});

const cleanText = (value, max) => typeof value === "string" ? value.trim().slice(0, max) : "";

const cleanMetadata = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value)
    .filter(([key, item]) => METADATA_KEYS.has(key) && ["string", "number", "boolean"].includes(typeof item))
    .slice(0, 10)
    .map(([key, item]) => [key, typeof item === "string" ? item.slice(0, 120) : item]));
};

const toBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]);
  return btoa(binary);
};

const hashIp = async (ip, secret) => {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(ip));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const signPayload = async (body, timestamp, privateJwk) => {
  const key = await crypto.subtle.importKey(
    "jwk",
    JSON.parse(privateJwk),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(`${timestamp}.${body}`),
  );
  return toBase64(signature);
};

const classifyAgent = (userAgent) => {
  const ua = userAgent.toLowerCase();
  const deviceType = /bot|crawler|spider|curl|wget/.test(ua)
    ? "bot"
    : /ipad|tablet/.test(ua)
      ? "tablet"
      : /mobile|android|iphone/.test(ua)
        ? "mobile"
        : "desktop";
  const browser = ua.includes("edg/") ? "Edge" : ua.includes("firefox/") ? "Firefox" : ua.includes("chrome/") ? "Chrome" : ua.includes("safari/") ? "Safari" : "Other";
  const os = ua.includes("windows") ? "Windows" : ua.includes("android") ? "Android" : /iphone|ipad|ios/.test(ua) ? "iOS" : ua.includes("mac os") ? "macOS" : ua.includes("linux") ? "Linux" : "Other";
  return { device_type: deviceType, browser, os };
};

const verifyTurnstile = async (token, ip, secret, expectedHostname) => {
  if (!token || !secret) return false;
  const form = new FormData();
  form.set("secret", secret);
  form.set("response", token);
  form.set("remoteip", ip);
  form.set("idempotency_key", crypto.randomUUID());
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  if (!response.ok) return false;
  const result = await response.json();
  return result.success === true && result.hostname === expectedHostname;
};

const sendToSupabase = async (payload, env) => {
  const body = JSON.stringify(payload);
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = await signPayload(body, timestamp, env.EDGE_SIGNING_PRIVATE_JWK);
  return fetch(env.SUPABASE_EDGE_GATEWAY_URL || "https://ktxhpqztorfzxkyeixcf.supabase.co/functions/v1/palve-edge-gateway", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Palve-Timestamp": timestamp,
      "X-Palve-Signature": signature,
    },
    body,
  });
};

export async function onRequestPost(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin !== url.origin) return json({ code: "origin_rejected" }, 403);
  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) return json({ code: "content_type_rejected" }, 415);
  if (Number(request.headers.get("Content-Length") || 0) > MAX_BODY_BYTES) return json({ code: "payload_too_large" }, 413);
  if (!env.EDGE_SIGNING_PRIVATE_JWK || !env.IP_HASH_SECRET) return json({ code: "gateway_unavailable" }, 503);

  let input;
  try {
    input = await request.json();
  } catch {
    return json({ code: "invalid_json" }, 400);
  }

  const ip = request.headers.get("CF-Connecting-IP") || "0.0.0.0";
  const ipHash = await hashIp(ip, env.IP_HASH_SECRET);
  const cf = request.cf || {};
  const agent = classifyAgent(request.headers.get("User-Agent") || "");
  const botScore = Number(cf.botManagement?.score || 0) || null;
  const edge = {
    ip_hash: ipHash,
    country_code: cleanText(cf.country, 2).toUpperCase() || null,
    region: cleanText(cf.region, 80) || null,
    city: cleanText(cf.city, 80) || null,
    timezone: cleanText(cf.timezone, 64) || null,
    latitude: Number.isFinite(Number(cf.latitude)) ? Math.round(Number(cf.latitude) * 10) / 10 : null,
    longitude: Number.isFinite(Number(cf.longitude)) ? Math.round(Number(cf.longitude) * 10) / 10 : null,
    asn: Number.isFinite(Number(cf.asn)) ? Number(cf.asn) : null,
    colo: cleanText(cf.colo, 3).toUpperCase() || null,
    bot_score: botScore,
    suspected_bot: agent.device_type === "bot" || (botScore !== null && botScore < 30),
    ...agent,
  };

  if (url.pathname === "/api/events") {
    if (request.headers.get("Sec-GPC") === "1" || request.headers.get("DNT") === "1") return new Response(null, { status: 204 });
    const event = {
      event_id: cleanText(input.event_id, 36),
      visitor_id: cleanText(input.visitor_id, 36),
      session_id: cleanText(input.session_id, 36),
      event_name: cleanText(input.event_name, 48),
      path: cleanText(input.path, 160),
      referrer_host: cleanText(input.referrer_host, 120) || null,
      metadata: cleanMetadata(input.metadata),
      occurred_at: cleanText(input.occurred_at, 32),
    };
    if (!UUID.test(event.event_id) || !UUID.test(event.visitor_id) || !UUID.test(event.session_id) || !EVENT_NAME.test(event.event_name) || !event.path.startsWith("/")) {
      return json({ code: "invalid_event" }, 400);
    }
    context.waitUntil(sendToSupabase({ action: "event", event, edge }, env));
    return new Response(null, { status: 202, headers: { "Cache-Control": "no-store" } });
  }

  if (url.pathname === "/api/guestbook") {
    if (!env.TURNSTILE_SECRET_KEY) return json({ code: "verification_unavailable" }, 503);
    const verified = await verifyTurnstile(cleanText(input.turnstile_token, 2048), ip, env.TURNSTILE_SECRET_KEY, url.hostname);
    if (!verified) return json({ code: "turnstile_failed" }, 403);
    const message = {
      request_id: cleanText(input.request_id, 36),
      visitor_id: cleanText(input.visitor_id, 36),
      display_name: cleanText(input.display_name, 24) || "ANONYMOUS",
      channel: cleanText(input.channel, 8),
      message: cleanText(input.message, 180),
    };
    if (!UUID.test(message.request_id) || !UUID.test(message.visitor_id) || !CHANNELS.has(message.channel) || !message.message) {
      return json({ code: "invalid_message" }, 400);
    }
    const response = await sendToSupabase({ action: "guestbook", message, edge }, env);
    const result = await response.json().catch(() => ({}));
    if (response.status === 429) return json({ code: "cooldown" }, 429);
    if (!response.ok) return json({ code: "archive_unavailable" }, 502);
    return json({ queued: result.queued === true }, 202);
  }

  return json({ code: "not_found" }, 404);
}
