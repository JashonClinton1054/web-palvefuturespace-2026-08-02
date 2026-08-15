import { useEffect, useRef } from "react";

const SCRIPT_ID = "palve-turnstile-script";
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const loadTurnstile = () => new Promise((resolve, reject) => {
  if (window.turnstile) {
    resolve(window.turnstile);
    return;
  }

  let script = document.getElementById(SCRIPT_ID);
  if (!script) {
    script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  const timeout = window.setTimeout(() => reject(new Error("turnstile-timeout")), 10000);
  const poll = window.setInterval(() => {
    if (!window.turnstile) return;
    window.clearTimeout(timeout);
    window.clearInterval(poll);
    resolve(window.turnstile);
  }, 80);
  script.addEventListener("error", () => {
    window.clearTimeout(timeout);
    window.clearInterval(poll);
    reject(new Error("turnstile-load-failed"));
  }, { once: true });
});

export default function TurnstileWidget({ onVerify, resetKey }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!SITE_KEY) {
      onVerify("");
      return undefined;
    }

    let active = true;
    let widgetId;
    onVerify("");

    loadTurnstile()
      .then((turnstile) => {
        if (!active || !containerRef.current) return;
        widgetId = turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme: "dark",
          size: "flexible",
          appearance: "interaction-only",
          callback: (token) => onVerify(token),
          "expired-callback": () => onVerify(""),
          "error-callback": () => onVerify(""),
        });
      })
      .catch(() => onVerify(""));

    return () => {
      active = false;
      if (widgetId !== undefined && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onVerify, resetKey]);

  return <div ref={containerRef} aria-label="安全验证" />;
}
