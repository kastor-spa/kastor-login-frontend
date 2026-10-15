/** Utilidades de fecha para formatos del legacy (DD-MM-YYYY) ↔ input type=date (YYYY-MM-DD). */
export function dmyToIso(dmy: string): string {
  const [d, m, y] = dmy.split('-')
  return `${y}-${m}-${d}`
}

export function isoToDmy(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}-${m}-${y}`
}

/** Hoy en YYYY-MM-DD (hora local). */
export function hoyIso(): string {
  const now = new Date()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${mm}-${dd}`
}

/** Primer día del mes actual en YYYY-MM-DD. */
export function inicioMesIso(): string {
  return `${hoyIso().slice(0, 8)}01`
}
