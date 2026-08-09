import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isSupabaseConfigured, trackEvent, trackingAllowed } from "../lib/supabase";

const getDeviceClass = () => {
  if (window.matchMedia("(max-width: 700px)").matches) return "mobile";
  if (window.matchMedia("(max-width: 1050px)").matches) return "tablet";
  return "desktop";
};

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (!isSupabaseConfigured || !trackingAllowed) return;
    const firstEvent = sessionStorage.getItem("palve-session-started") !== "1";
    if (firstEvent) {
      sessionStorage.setItem("palve-session-started", "1");
      void trackEvent("session_start", {
        device: getDeviceClass(),
        language: navigator.language,
        reduced_motion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !trackingAllowed) return;
    const timer = window.setTimeout(() => {
      void trackEvent("page_view", {
        title: document.title,
        device: getDeviceClass(),
      });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    if (!isSupabaseConfigured || !trackingAllowed) return undefined;
    const onClick = (event) => {
      const target = event.target.closest?.("[data-track]");
      if (!target) return;
      void trackEvent("interaction", { action: target.dataset.track });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
