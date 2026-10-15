import { createStore } from '@/lib/create-store'

/**
 * Notificaciones del header. DATOS DUMMY: el legacy no tiene centro de notificaciones.
 * Cada tipo apunta a un módulo real para que la navegación sea coherente.
 */
export type TipoNotificacion = 'tarea' | 'factura' | 'cobranza' | 'uf' | 'sistema'
export type Severidad = 'info' | 'warning' | 'danger' | 'success'

export interface Notificacion {
  id: string
  tipo: TipoNotificacion
  severidad: Severidad
  titulo: string
  descripcion: string
  /** ISO 8601 */
  fecha: string
  leida: boolean
  /** Ruta interna a la que lleva al hacer clic. */
  href?: string
}

const hace = (min: number) => new Date(Date.now() - min * 60_000).toISOString()

const seed: Notificacion[] = [
  { id: 'n1', tipo: 'factura', severidad: 'danger', titulo: 'Factura vencida', descripcion: 'La factura 31275 de Edificios Alderete Cook (sectores) venció el 14-09-2026.', fecha: hace(12), leida: false, href: '/facturas/kastor' },
  { id: 'n2', tipo: 'tarea', severidad: 'warning', titulo: 'Tarea por vencer hoy', descripcion: 'Validar configuración SCA manual · CONDOMINIO CONCEPTO DESIGN SAN DAMIAN.', fecha: hace(45), leida: false, href: '/tareas' },
  { id: 'n3', tipo: 'cobranza', severidad: 'warning', titulo: 'Liberación sin notificar', descripcion: 'Administradora Acodef Ltda tiene la liberación de 03-2026 en estado No Notificado.', fecha: hace(130), leida: false, href: '/cobranza' },
  { id: 'n4', tipo: 'uf', severidad: 'info', titulo: 'Falta valor UF de noviembre', descripcion: 'Registra el valor UF de 2026-11 para el reporte Control Presupuestario.', fecha: hace(60 * 5), leida: false, href: '/uf' },
  { id: 'n5', tipo: 'cobranza', severidad: 'success', titulo: 'Gasto común liberado', descripcion: 'Comunidad Nueva España 1 liberó el gasto común de 09-2026.', fecha: hace(60 * 26), leida: true, href: '/cobranza' },
  { id: 'n6', tipo: 'factura', severidad: 'info', titulo: 'Nueva factura Caleu', descripcion: 'Se emitió la factura 50157 para Edificio San Pablo por $32.990.', fecha: hace(60 * 30), leida: true, href: '/facturas/caleu' },
  { id: 'n7', tipo: 'sistema', severidad: 'info', titulo: 'Mantención programada', descripcion: 'El sistema estará en mantención el sábado de 22:00 a 23:30.', fecha: hace(60 * 50), leida: true },
  { id: 'n8', tipo: 'tarea', severidad: 'success', titulo: 'Tarea finalizada', descripcion: 'Revisar cierre de gasto común de septiembre · COMUNIDAD CAMINO LA VILLA.', fecha: hace(60 * 24 * 4), leida: true, href: '/tareas' },
]

export const notificacionesStore = createStore<Notificacion[]>(seed)

export function marcarLeida(id: string) {
  notificacionesStore.set((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)))
}

export function marcarTodasLeidas() {
  notificacionesStore.set((prev) => prev.map((n) => ({ ...n, leida: true })))
}

export function eliminarNotificacion(id: string) {
  notificacionesStore.set((prev) => prev.filter((n) => n.id !== id))
}

/** "hace 12 min", "hace 2 h", "ayer", "hace 4 días" */
export function tiempoRelativo(iso: string, ahora = Date.now()): string {
  const min = Math.max(0, Math.round((ahora - new Date(iso).getTime()) / 60_000))
  if (min < 1) return 'ahora'
  if (min < 60) return `hace ${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return `hace ${h} h`
  const d = Math.round(h / 24)
  return d === 1 ? 'ayer' : `hace ${d} días`
}
