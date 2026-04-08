#!/bin/sh
set -eu

API_URL_VALUE="${API_URL:-http://localhost:5273/api}"

cat <<EOF >/usr/share/nginx/html/env.js
window.__env = window.__env || {};
window.__env.apiUrl = "${API_URL_VALUE}";
EOF
