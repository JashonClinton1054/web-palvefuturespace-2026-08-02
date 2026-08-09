import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

export const trackingAllowed = navigator.globalPrivacyControl !== true && navigator.doNotTrack !== "1";

const createUuid = () => {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const getStoredUuid = (storage, key) => {
  try {
    const stored = storage.getItem(key);
    if (stored) return stored;
    const id = createUuid();
    storage.setItem(key, id);
    return id;
  } catch {
    return createUuid();
  }
};

export const visitorId = getStoredUuid(
  trackingAllowed ? window.localStorage : window.sessionStorage,
  trackingAllowed ? "palve-visitor-id" : "palve-private-visitor-id",
);
export const sessionId = getStoredUuid(window.sessionStorage, "palve-session-id");

const cleanMetadata = (metadata) => Object.fromEntries(
  Object.entries(metadata)
    .filter(([, value]) => ["string", "number", "boolean"].includes(typeof value))
    .slice(0, 12)
    .map(([key, value]) => [key.slice(0, 48), typeof value === "string" ? value.slice(0, 160) : value]),
);

export const trackEvent = async (eventName, metadata = {}) => {
  if (!supabase || !trackingAllowed) return;

  let referrerHost = null;
  try {
    const referrer = document.referrer ? new URL(document.referrer) : null;
    if (referrer && referrer.origin !== window.location.origin) referrerHost = referrer.hostname.slice(0, 120);
  } catch {
    referrerHost = null;
  }

  await supabase.from("site_events").insert({
    visitor_id: visitorId,
    session_id: sessionId,
    event_name: eventName.slice(0, 48),
    path: window.location.pathname.slice(0, 160),
    referrer_host: referrerHost,
    metadata: cleanMetadata(metadata),
  });
};
