export interface Community {
  id: string
  name: string
  rut: string
  /** Período MM-YYYY. */
  ultimoProrrateo: string
  /** Período MM-YYYY. */
  ultimoCierreRem: string
  liberado: boolean
  tcel: boolean
  /** Rango o período de conciliación, texto libre. */
  conciliacion: string
  usuario: string
  /** Comunidad activa: encabezado naranja. Inactiva: encabezado gris. */
  activa: boolean
  /** Alerta pendiente: indicador rojo en vez de verde. */
  alerta: boolean
}

export const communities: Community[] = [
  { id: 'c01', name: 'Administradora Acodef Ltda', rut: '77834007-0', ultimoProrrateo: '03-2026', ultimoCierreRem: '09-2026', liberado: true, tcel: true, conciliacion: 'Mar 26', usuario: 'edificio_tm', activa: true, alerta: false },
  { id: 'c02', name: 'Comunidad Camino La Villa', rut: '56068230-1', ultimoProrrateo: '07-2026', ultimoCierreRem: '08-2026', liberado: true, tcel: true, conciliacion: '01-08 al 30-08-2026', usuario: 'edificio_dt', activa: true, alerta: false },
  { id: 'c03', name: 'Comunidad Camino La Villa', rut: '56068230-1', ultimoProrrateo: '06-2026', ultimoCierreRem: '06-2026', liberado: true, tcel: true, conciliacion: '01-06-2026 al 30-06-2026', usuario: 'alvaro_barahona', activa: false, alerta: true },
  { id: 'c04', name: 'Comunidad Camino La Villa', rut: '56068230-1', ultimoProrrateo: '08-2026', ultimoCierreRem: '08-2026', liberado: true, tcel: true, conciliacion: '01-09 al 08-09-2026', usuario: 'edificio_swt2', activa: true, alerta: false },
  { id: 'c05', name: 'Edificio Los Alerces', rut: '65432100-9', ultimoProrrateo: '09-2026', ultimoCierreRem: '09-2026', liberado: true, tcel: false, conciliacion: '01-09 al 30-09-2026', usuario: 'edificio_alerces', activa: true, alerta: false },
  { id: 'c06', name: 'Condominio Vista Mar', rut: '76112233-4', ultimoProrrateo: '08-2026', ultimoCierreRem: '08-2026', liberado: false, tcel: true, conciliacion: 'Ago 26', usuario: 'vistamar_adm', activa: true, alerta: true },
  { id: 'c07', name: 'Torre Central', rut: '77001122-K', ultimoProrrateo: '09-2026', ultimoCierreRem: '09-2026', liberado: true, tcel: true, conciliacion: '01-09 al 30-09-2026', usuario: 'torre_central', activa: true, alerta: false },
  { id: 'c08', name: 'Parque Oriente', rut: '65998877-2', ultimoProrrateo: '05-2026', ultimoCierreRem: '05-2026', liberado: true, tcel: false, conciliacion: 'May 26', usuario: 'parque_oriente', activa: false, alerta: true },
  { id: 'c09', name: 'Jardines del Sur', rut: '76554433-8', ultimoProrrateo: '09-2026', ultimoCierreRem: '08-2026', liberado: true, tcel: true, conciliacion: '01-09 al 15-09-2026', usuario: 'jardines_sur', activa: true, alerta: false },
  { id: 'c10', name: 'Edificio Mirador', rut: '77889900-5', ultimoProrrateo: '09-2026', ultimoCierreRem: '09-2026', liberado: true, tcel: true, conciliacion: 'Sep 26', usuario: 'edificio_mirador', activa: true, alerta: false },
  { id: 'c11', name: 'Altos de Ñuñoa', rut: '65123456-7', ultimoProrrateo: '07-2026', ultimoCierreRem: '07-2026', liberado: false, tcel: false, conciliacion: 'Jul 26', usuario: 'altos_nunoa', activa: false, alerta: false },
  { id: 'c12', name: 'Plaza Norte', rut: '76777888-1', ultimoProrrateo: '09-2026', ultimoCierreRem: '09-2026', liberado: true, tcel: true, conciliacion: '01-09 al 30-09-2026', usuario: 'plaza_norte', activa: true, alerta: false },
]
