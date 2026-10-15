/**
 * Indicadores de la comunidad: "Incidencia de Gasto Común" por mes/año.
 * Evidencia: docs/referencias/inicio-comunidad/01-home.png (Administradora Acodef Ltda, Marzo 2026).
 * Los montos de esa captura son la base; el resto de meses y comunidades son variaciones mock.
 */

export interface CategoriaGasto {
  slug: string
  /** Texto exacto del legacy. */
  nombre: string
  /** Variable CSS de la paleta categórica (orden fijo, nunca por ranking). */
  color: string
}

/** Orden y nombres tal como aparecen en la leyenda del legacy. */
export const categoriasGasto: CategoriaGasto[] = [
  { slug: 'oficina', nombre: 'GASTOS OFICINA', color: 'var(--viz-1)' },
  { slug: 'administracion', nombre: 'GASTOS ADMINISTRACION', color: 'var(--viz-2)' },
  { slug: 'no-operacionales', nombre: 'GASTOS NO OPERACIONALES', color: 'var(--viz-3)' },
  { slug: 'operacionales', nombre: 'GASTOS OPERACIONALES', color: 'var(--viz-4)' },
  { slug: 'rrhh', nombre: 'GASTOS RRHH', color: 'var(--viz-5)' },
  { slug: 'remuneraciones', nombre: 'Remuneraciones', color: 'var(--viz-6)' },
]

/** Montos de la captura (Marzo 2026). */
const base: Record<string, number> = {
  oficina: 5_881_890,
  administracion: 2_608_657,
  'no-operacionales': 2_241_460,
  operacionales: 3_229_654,
  rrhh: 11_618_943,
  remuneraciones: 51_238_229,
}

export const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export const anios = [2024, 2025, 2026]

/** Ruido determinista en [-1, 1] a partir de una semilla de texto. */
function ruido(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  return ((h >>> 0) % 2000) / 1000 - 1
}

export interface IncidenciaGasto {
  slug: string
  monto: number
}

/** Gasto común por categoría para una comunidad y período (mes 1-12). */
export function incidenciaGastoComun(comunidadId: string, mes: number, anio: number): IncidenciaGasto[] {
  const escala = 1 + ruido(comunidadId) * 0.35
  return categoriasGasto.map(({ slug }) => {
    const esCaptura = comunidadId === 'c01' && mes === 3 && anio === 2026
    const variacion = esCaptura ? 1 : escala * (1 + ruido(`${comunidadId}-${slug}-${mes}-${anio}`) * 0.18)
    return { slug, monto: Math.round(base[slug] * variacion) }
  })
}
