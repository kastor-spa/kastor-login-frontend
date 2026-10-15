const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })

/** 1250000 → "$1.250.000". Corrige el bug del legacy (solo reemplazaba la primera coma). */
export function formatCLP(n: number): string {
  return clp.format(Math.round(n || 0))
}
