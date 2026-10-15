#!/usr/bin/env bash
# Captura una URL PÚBLICA del legacy: HTML (curl) + screenshot (Chrome headless).
# Uso: capturar-url.sh <url> <slug>
# Aborta si la URL redirige a /login (requiere sesión: no se captura desde aquí).
set -euo pipefail

URL="${1:-}"
SLUG="${2:-}"
if [[ -z "$URL" || -z "$SLUG" ]]; then
  echo "Uso: capturar-url.sh <url> <slug>" >&2
  exit 2
fi

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
DEST="$ROOT/docs/referencias/$SLUG"
mkdir -p "$DEST"

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 Chrome/128 Safari/537.36"
TMP_HTML="$(mktemp)"
META="$(curl -sL -A "$UA" -o "$TMP_HTML" -w "%{http_code} %{url_effective}" "$URL")"
STATUS="${META%% *}"
EFFECTIVE="${META#* }"

# 1) HTTP no OK (404, 500...)
if [[ "$STATUS" != "200" ]]; then
  rm -f "$TMP_HTML"
  echo "ABORTADO: $URL respondió HTTP $STATUS ($EFFECTIVE). La ruta no es pública o no existe." >&2
  exit 3
fi
# 2) Requiere sesión: redirige a la página de login o la sirve inline.
#    Solo se permite capturar la propia página de login (/login/ o /login/entrar).
PATH_REQ="$(printf '%s' "$URL" | sed -E 's#^https?://[^/]+##; s#[?\#].*$##; s#/+$##')"
IS_LOGIN_PAGE=0
[[ "$PATH_REQ" == "/login" || "$PATH_REQ" == "/login/entrar" ]] && IS_LOGIN_PAGE=1
if [[ "$IS_LOGIN_PAGE" -eq 0 ]]; then
  if [[ "$EFFECTIVE" == *"/login/entrar"* ]] || grep -qiE 'name="password"|<title>[^<]*Login[^<]*</title>|Iniciar sesi' "$TMP_HTML"; then
    rm -f "$TMP_HTML"
    echo "ABORTADO: $URL requiere sesión (devolvió el login en $EFFECTIVE). Pide captura o HTML guardado del módulo." >&2
    exit 3
  fi
fi

# Prefijo correlativo por par HTML+PNG (01, 02, ...)
N="$( (ls "$DEST" 2>/dev/null | grep -oE '^[0-9]{2}' || true) | sort -u | wc -l | tr -d ' ')"
PREFIX="$(printf '%02d' $((N + 1)))"
mv "$TMP_HTML" "$DEST/$PREFIX-pagina.html"
echo "HTML -> $DEST/$PREFIX-pagina.html ($EFFECTIVE)"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [[ -x "$CHROME" ]]; then
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1600,1000 \
    --virtual-time-budget=6000 --screenshot="$DEST/$PREFIX-captura.png" "$URL" >/dev/null 2>&1 || true
  [[ -f "$DEST/$PREFIX-captura.png" ]] && echo "PNG  -> $DEST/$PREFIX-captura.png"
else
  echo "Chrome no encontrado; solo se guardó el HTML." >&2
fi
