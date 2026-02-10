#!/bin/sh
set -e

CONFIG_FILE="/usr/share/nginx/html/config.js"
MAP_KEY=""

# Read the secret at RUNTIME (when the container starts)
if [ -f "/run/secrets/map_api_key" ]; then
    MAP_KEY=$(cat /run/secrets/map_api_key | xargs)
    echo "Info: Injecting Map Key from secrets."
else
    echo "Warning: No Map Key secret found."
fi

# Create global config object
echo "window.__RUNTIME_CONFIG__ = { \"VITE_MAP_API_KEY\": \"$MAP_KEY\" };" > "$CONFIG_FILE"

exec "$@"