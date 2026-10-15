/**
 * Configuración UF. Ver docs/mapas/MAPA-uf.md.
 * 2026 es real (docs/referencias/uf/01-pagina.html); 2025, 2027 y 2028 son mock.
 */
export interface MesUf {
  nombre: string
  numero: string // '01'..'12'
}

export const mesesUf: MesUf[] = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
].map((nombre, i) => ({ nombre, numero: String(i + 1).padStart(2, '0') }))

export interface ValoresUfAnio {
  /** Monto por período "AAAA-MM"; ausente = sin registro. */
  valores: Record<string, number>
  /** "DD/MM/YYYY HH:mm" */
  ultimaEdicion: string | null
}

export const aniosUf = [2028, 2027, 2026, 2025]

export const valoresUfSeed: Record<number, ValoresUfAnio> = {
  2025: { valores: {}, ultimaEdicion: null },
  2026: { valores: { '2026-01': 1, '2026-09': 60000, '2026-10': 70000 }, ultimaEdicion: '04/09/2026 20:41' },
  2027: { valores: { '2027-01': 70000, '2027-02': 70500 }, ultimaEdicion: '04/09/2026 20:41' },
  2028: { valores: {}, ultimaEdicion: null },
}

/** Sesión mock. */
export const sesionUf = {
  correo: 'hector.barrera@kastor.cl',
  esPerfilAdmin: true,
  /** Contraseña maestra de demo (solo frontend). */
  claveMaestraDemo: '1234',
}

export const TOOLTIP_PERIODO_UF =
  'El sistema utilizará el valor UF del período correspondiente al consultar el reporte Control Presupuestario.'

/** 60000 → "60000,00" (sin separador de miles, como el legacy). */
export function formatearMontoUf(n: number): string {
  return (Number(n) || 0).toFixed(2).replace('.', ',')
}

/** "60.000,5" → 60000.5 */
export function limpiarNumeroUf(s: string): number {
  const v = String(s || '').replace(/\./g, '').replace(',', '.').replace(/[^0-9.]/g, '')
  return parseFloat(v) || 0
}

/** Solo dígitos y una coma. */
export function sanearEntradaUf(s: string): string {
  const v = String(s || '').replace(/[^0-9,]/g, '')
  const partes = v.split(',')
  return partes.length > 2 ? `${partes[0]},${partes.slice(1).join('')}` : v
}

export function ahoraLegacy(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`
}
