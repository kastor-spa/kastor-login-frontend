#!/usr/bin/env bash
# Captura una página usando el Chrome PRINCIPAL del usuario (su sesión real) vía AppleScript.
# Usa el comando "save ... as only html" de Chrome: no requiere permiso de JavaScript ni
# toca cookies/contraseñas. Screenshot opcional (requiere permiso de grabación de pantalla).
# Uso: capturar-chrome.sh <slug> [url] [--sin-captura]
#   Sin url: guarda la pestaña de kastor.cl activa tal como está. Con url: navega y espera.
set -euo pipefail
SLUG="${1:-}"; URL="${2:-}"
[[ -z "$SLUG" ]] && { echo "Uso: capturar-chrome.sh <slug> [url] [--sin-captura]" >&2; exit 2; }
[[ "$URL" == "--sin-captura" ]] && URL=""
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
DEST="$ROOT/docs/referencias/$SLUG"; mkdir -p "$DEST"

# Localiza (o crea) la pestaña de kastor.cl y la deja activa al frente
osascript -e "tell application \"Google Chrome\"
  activate
  set target to \"$URL\"
  set found to false
  set wi to 0
  repeat with w in windows
    set wi to wi + 1
    set ti to 0
    repeat with t in tabs of w
      set ti to ti + 1
      if (target is not \"\" and URL of t starts with target) or (target is \"\" and URL of t contains \"kastor.cl\") then
        set active tab index of window wi to ti
        set index of window wi to 1
        set found to true
        exit repeat
      end if
    end repeat
    if found then exit repeat
  end repeat
  if not found then
    if target is \"\" then error \"No hay pestaña de kastor.cl abierta\"
    set wi to 0
    repeat with w in windows
      set wi to wi + 1
      set ti to 0
      repeat with t in tabs of w
        set ti to ti + 1
        if URL of t contains \"kastor.cl\" then
          set URL of t to target
          set active tab index of window wi to ti
          set index of window wi to 1
          set found to true
          exit repeat
        end if
      end repeat
      if found then exit repeat
    end repeat
    if not found then tell front window to make new tab with properties {URL:target}
  end if
end tell" >/dev/null

if [[ -n "$URL" ]]; then
  for i in $(seq 1 60); do
    sleep 0.5
    st="$(osascript -e 'tell application "Google Chrome" to get loading of active tab of front window' 2>/dev/null || echo true)"
    [[ "$st" == "false" ]] && break
  done
  sleep 2 # scripts / ajax
fi

LOC="$(osascript -e 'tell application "Google Chrome" to get URL of active tab of front window')"
TITLE="$(osascript -e 'tell application "Google Chrome" to get title of active tab of front window')"
if [[ "$LOC" == *"/entrar"* || "$TITLE" == Login* ]]; then
  echo "ABORTADO: la pestaña está en el login ($LOC). Inicia sesión en Chrome y reintenta." >&2; exit 4
fi

N="$( (ls "$DEST" 2>/dev/null | grep -oE '^[0-9]{2}' || true) | sort -u | wc -l | tr -d ' ')"
PREFIX="$(printf '%02d' $((N + 1)))"
OUT="$DEST/$PREFIX-pagina.html"
osascript -e "tell application \"Google Chrome\" to save active tab of front window in POSIX file \"$OUT\" as \"only html\"" >/dev/null
for i in $(seq 1 20); do [[ -s "$OUT" ]] && break; sleep 0.5; done
[[ -s "$OUT" ]] || { echo "ABORTADO: Chrome no guardó el HTML." >&2; exit 6; }
# Encabezado con origen
TMP="$(mktemp)"; printf '<!-- origen: %s | %s -->\n' "$LOC" "$TITLE" > "$TMP"; cat "$OUT" >> "$TMP"; mv "$TMP" "$OUT"
echo "URL   : $LOC"
echo "Título: $TITLE"
echo "HTML  -> docs/referencias/$SLUG/$PREFIX-pagina.html ($(wc -c < "$OUT" | tr -d ' ') bytes)"

if [[ "${3:-}" != "--sin-captura" ]]; then
  sleep 0.5
  if screencapture -x "$DEST/$PREFIX-captura.png" 2>/dev/null && [[ -s "$DEST/$PREFIX-captura.png" ]]; then
    echo "PNG   -> docs/referencias/$SLUG/$PREFIX-captura.png"
  else
    rm -f "$DEST/$PREFIX-captura.png"
    echo "PNG   : omitido (sin permiso de grabación de pantalla para esta terminal)"
  fi
fi
