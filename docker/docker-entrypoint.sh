#!/bin/sh
set -e

CONFIG="$(jq -n \
  --arg url "${VITE_API_URL:-}" \
  --arg domain "${VITE_API_DOMAIN:-}" \
  '{VITE_API_URL: $url, VITE_API_DOMAIN: $domain}')"
printf 'window.__APP_ENV__ = %s;\n' "$CONFIG" > /usr/share/nginx/html/env-config.js

exec nginx -g "daemon off;"
