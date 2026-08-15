import { useEffect, useRef } from "react";

const SCRIPT_ID = "palve-turnstile-script";
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const loadTurnstileOnce = () => new Promise((resolve, reject) => {
  if (window.turnstile) {
    resolve(window.turnstile);
    return;
  }

  let script = document.getElementById(SCRIPT_ID);
  if (script?.dataset.failed === "true") {
    script.remove();
    script = null;
  }
  if (!script) {
    script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  const cleanup = () => {
    window.clearTimeout(timeout);
    window.clearInterval(poll);
  };
  const timeout = window.setTimeout(() => {
    script.dataset.failed = "true";
    cleanup();
    reject(new Error("turnstile-timeout"));
  }, 10000);
  const poll = window.setInterval(() => {
    if (!window.turnstile) return;
    cleanup();
    resolve(window.turnstile);
  }, 80);
  script.addEventListener("error", () => {
    script.dataset.failed = "true";
    cleanup();
    reject(new Error("turnstile-load-failed"));
  }, { once: true });
});

const loadTurnstile = async () => {
  try {
    return await loadTurnstileOnce();
  } catch {
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    return loadTurnstileOnce();
  }
};

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
          appearance: "always",
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
