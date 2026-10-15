/**
 * Tareas. Ver docs/mapas/MAPA-tareas.md.
 * El listado legacy venía vacío: los registros son ficticios sobre comunidades reales del catálogo.
 */
export type EstadoTarea = 'pendiente' | 'finalizada'
export type FiltroEstadoTarea = 'todos' | EstadoTarea

export interface Tarea {
  id: number
  tarea: string
  /** DD-MM-YYYY */
  fechaInicio: string
  /** DD-MM-YYYY */
  fechaHasta: string
  comunidadId: number
  comunidadNombre: string
  estado: EstadoTarea
}

export const estadoTareaLabels: Record<EstadoTarea, string> = {
  pendiente: 'Pendiente',
  finalizada: 'Finalizada',
}

export const tareas: Tarea[] = [
  { id: 1, tarea: 'Revisar cierre de gasto común de septiembre', fechaInicio: '01-10-2026', fechaHasta: '05-10-2026', comunidadId: 10156, comunidadNombre: 'COMUNIDAD CAMINO LA VILLA', estado: 'finalizada' },
  { id: 2, tarea: 'Contactar administración por liberación pendiente', fechaInicio: '07-10-2026', fechaHasta: '10-10-2026', comunidadId: 11847, comunidadNombre: 'Administradora Acodef Ltda', estado: 'pendiente' },
  { id: 3, tarea: 'Validar configuración SCA manual', fechaInicio: '09-10-2026', fechaHasta: '14-10-2026', comunidadId: 9858, comunidadNombre: 'CONDOMINIO CONCEPTO DESIGN SAN DAMIAN', estado: 'pendiente' },
  { id: 4, tarea: 'Cargar lecturas de medidores', fechaInicio: '14-10-2026', fechaHasta: '14-10-2026', comunidadId: 11846, comunidadNombre: 'Comunidad Nueva España 1', estado: 'pendiente' },
  { id: 5, tarea: 'Enviar recordatorio de pago a copropietarios', fechaInicio: '02-10-2026', fechaHasta: '03-10-2026', comunidadId: 11044, comunidadNombre: 'Rapelco', estado: 'finalizada' },
]
