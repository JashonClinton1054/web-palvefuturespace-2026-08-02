import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.2";

const PUBLIC_KEY: JsonWebKey = {
  kty: "EC",
  x: "BpplBQOtcWBEYYXhrV9tBV6_9azTv6Abyf6dixr1ERs",
  y: "hgQZI_mnc-eWLL-Z1F0r2909Ib8VPxzhmJ8jhjghhDU",
  crv: "P-256",
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EVENT_NAME = /^[a-z][a-z0-9_]{1,47}$/;
const CHANNELS = new Set(["问候", "灵感", "雨夜"]);

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
});

const fromBase64 = (value: string) => {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const verifyRequest = async (request: Request, body: string) => {
  const timestamp = request.headers.get("X-Palve-Timestamp") || "";
  const signature = request.headers.get("X-Palve-Signature") || "";
  const seconds = Number(timestamp);
  if (!Number.isInteger(seconds) || Math.abs(Date.now() / 1000 - seconds) > 60 || !signature) return false;

  try {
    const key = await crypto.subtle.importKey("jwk", PUBLIC_KEY, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
    return crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-256" },
      key,
      fromBase64(signature),
      new TextEncoder().encode(`${timestamp}.${body}`),
    );
  } catch {
    return false;
  }
};

const cleanText = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
const finiteNumber = (value: unknown, min: number, max: number) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max ? number : null;
};

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ code: "method_not_allowed" }, 405);
  if (Number(request.headers.get("Content-Length") || 0) > 8192) return json({ code: "payload_too_large" }, 413);

  const rawBody = await request.text();
  if (!(await verifyRequest(request, rawBody))) return json({ code: "forbidden" }, 403);

  let input: Record<string, unknown>;
  try {
    input = JSON.parse(rawBody);
  } catch {
    return json({ code: "invalid_json" }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json({ code: "configuration_error" }, 500);
  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const edge = input.edge && typeof input.edge === "object" ? input.edge as Record<string, unknown> : {};
  const edgeRecord = {
    ip_hash: /^[0-9a-f]{64}$/.test(cleanText(edge.ip_hash, 64)) ? edge.ip_hash : null,
    country_code: /^[A-Z]{2}$/.test(cleanText(edge.country_code, 2)) ? edge.country_code : null,
    region: cleanText(edge.region, 80) || null,
    city: cleanText(edge.city, 80) || null,
    timezone: cleanText(edge.timezone, 64) || null,
    latitude_coarse: finiteNumber(edge.latitude, -90, 90),
    longitude_coarse: finiteNumber(edge.longitude, -180, 180),
    asn: finiteNumber(edge.asn, 1, 2147483647),
    colo: /^[A-Z0-9]{3}$/.test(cleanText(edge.colo, 3)) ? edge.colo : null,
    device_type: ["desktop", "mobile", "tablet", "bot"].includes(edge.device_type) ? edge.device_type : "unknown",
    browser: cleanText(edge.browser, 32) || "Other",
    os: cleanText(edge.os, 32) || "Other",
    suspected_bot: edge.suspected_bot === true,
  };

  if (input.action === "event") {
    const event = input.event && typeof input.event === "object" ? input.event as Record<string, unknown> : {};
    const eventId = cleanText(event.event_id, 36);
    const visitorId = cleanText(event.visitor_id, 36);
    const sessionId = cleanText(event.session_id, 36);
    const eventName = cleanText(event.event_name, 48);
    const path = cleanText(event.path, 160);
    const occurredAt = Date.parse(cleanText(event.occurred_at, 32));
    if (!UUID.test(eventId) || !UUID.test(visitorId) || !UUID.test(sessionId)
      || !EVENT_NAME.test(eventName) || !path.startsWith("/")
      || !Number.isFinite(occurredAt) || Math.abs(Date.now() - occurredAt) > 300000) {
      return json({ code: "invalid_event" }, 400);
    }

    const { error } = await supabase.from("edge_events").insert({
      request_id: eventId,
      visitor_id: visitorId,
      session_id: sessionId,
      event_name: eventName,
      path,
      referrer_host: cleanText(event.referrer_host, 120) || null,
      metadata: event.metadata && typeof event.metadata === "object" && !Array.isArray(event.metadata) ? event.metadata : {},
      occurred_at: new Date(occurredAt).toISOString(),
      ...edgeRecord,
    });
    if (error && error.code !== "23505") return json({ code: "storage_error" }, 500);
    return new Response(null, { status: 204 });
  }

  if (input.action === "guestbook") {
    const message = input.message && typeof input.message === "object" ? input.message as Record<string, unknown> : {};
    const requestId = cleanText(message.request_id, 36);
    const visitorId = cleanText(message.visitor_id, 36);
    const channel = cleanText(message.channel, 8);
    const messageText = cleanText(message.message, 180);
    if (!UUID.test(requestId) || !UUID.test(visitorId) || !CHANNELS.has(channel)
      || !messageText || !edgeRecord.ip_hash) {
      return json({ code: "invalid_message" }, 400);
    }
    const { data, error } = await supabase.rpc("edge_submit_guestbook", {
      p_request_id: requestId,
      p_visitor_id: visitorId,
      p_display_name: cleanText(message.display_name, 24) || "ANONYMOUS",
      p_channel: channel,
      p_message: messageText,
      p_ip_hash: edgeRecord.ip_hash,
      p_country_code: edgeRecord.country_code,
    });
    if (error?.message?.includes("cooldown")) return json({ code: "cooldown" }, 429);
    if (error) return json({ code: "storage_error" }, 500);
    return json({ queued: Boolean(data) }, 202);
  }

  return json({ code: "invalid_action" }, 400);
});
