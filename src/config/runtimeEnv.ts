declare global {
  interface Window {
    __APP_ENV__?: {
      VITE_API_URL?: string;
      VITE_API_DOMAIN?: string;
    };
  }
}

function fromRuntimeOrLocal(
  key: "VITE_API_URL" | "VITE_API_DOMAIN",
): string | undefined {
  const fromWindow =
    typeof window !== "undefined" ? window.__APP_ENV__?.[key] : undefined;
  if (import.meta.env.PROD) {
    return fromWindow;
  }
  return fromWindow || import.meta.env[key];
}

export function getViteApiUrl(): string {
  return (fromRuntimeOrLocal("VITE_API_URL") || "").replace(/\/$/, "");
}

export function getViteApiDomain(): string | undefined {
  return fromRuntimeOrLocal("VITE_API_DOMAIN");
}
