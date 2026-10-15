/**
 * Sistema de Cobranza (SCA). Datos extraídos del HTML real del legacy
 * (docs/referencias/sistema-cobranza/01-pagina.html, 2026-10-14). Ver MAPA-sistema-cobranza.md.
 */
export type TipoSca = 0 | 1 | 2
export type EstadoLiberacion = 'notificado' | 'no_notificado'

export interface ComunidadSCA {
  id: number
  nombre: string
  /** Período MM-YYYY. */
  ultimoGastoComun: string | null
  /** YYYY-MM-DD HH:mm:ss */
  fechaUltimoCierre: string | null
  /** YYYY-MM-DD HH:mm:ss */
  fechaUltimaLiberacion: string | null
  estadoLiberacion: EstadoLiberacion | null
  /** 0 Desactivado · 1 Automático · 2 Manual. Filas sin `selected` en el legacy se asumen 0. */
  tipoSca: TipoSca
}

export const tiposSca: { value: TipoSca; label: string }[] = [
  { value: 0, label: 'Desactivado' },
  { value: 1, label: 'Automático' },
  { value: 2, label: 'Manual' },
]

export const estadosLiberacion: Record<EstadoLiberacion, string> = {
  notificado: 'Si Notificado',
  no_notificado: 'No Notificado',
}

export const comunidadesSca: ComunidadSCA[] = [
  { id: 10155, nombre: "", ultimoGastoComun: null, fechaUltimoCierre: null, fechaUltimaLiberacion: null, estadoLiberacion: null, tipoSca: 0 },
  { id: 11042, nombre: "", ultimoGastoComun: "06-2026", fechaUltimoCierre: "2026-07-14 16:07:01", fechaUltimaLiberacion: "2026-07-21 13:52:13", estadoLiberacion: "no_notificado", tipoSca: 0 },
  { id: 11847, nombre: "Administradora Acodef Ltda", ultimoGastoComun: "03-2026", fechaUltimoCierre: "2026-04-01 12:24:10", fechaUltimaLiberacion: "2026-04-01 18:55:03", estadoLiberacion: "no_notificado", tipoSca: 0 },
  { id: 10156, nombre: "COMUNIDAD CAMINO LA VILLA", ultimoGastoComun: "07-2026", fechaUltimoCierre: "2026-08-05 13:08:52", fechaUltimaLiberacion: "2026-08-05 13:11:21", estadoLiberacion: "notificado", tipoSca: 1 },
  { id: 12040, nombre: "COMUNIDAD CAMINO LA VILLA", ultimoGastoComun: "06-2026", fechaUltimoCierre: "2026-07-02 18:01:23", fechaUltimaLiberacion: "2026-07-02 18:07:42", estadoLiberacion: "notificado", tipoSca: 1 },
  { id: 12173, nombre: "COMUNIDAD CAMINO LA VILLA", ultimoGastoComun: "08-2026", fechaUltimoCierre: "2026-09-02 17:29:23", fechaUltimaLiberacion: "2026-09-02 17:30:04", estadoLiberacion: "notificado", tipoSca: 1 },
  { id: 12182, nombre: "COMUNIDAD CAMINO LA VILLA", ultimoGastoComun: "08-2026", fechaUltimoCierre: "2026-09-02 17:29:23", fechaUltimaLiberacion: "2026-09-02 17:30:04", estadoLiberacion: "notificado", tipoSca: 1 },
  { id: 8811, nombre: "COMUNIDAD EDIFICIO DON ALONSO", ultimoGastoComun: "03-2025", fechaUltimoCierre: "2025-04-02 10:39:59", fechaUltimaLiberacion: "2025-04-02 17:51:19", estadoLiberacion: "notificado", tipoSca: 1 },
  { id: 10189, nombre: "COMUNIDAD EDIFICIO LOFTS BICENTENARIO", ultimoGastoComun: "09-2026", fechaUltimoCierre: "2026-10-07 11:35:21", fechaUltimaLiberacion: null, estadoLiberacion: null, tipoSca: 0 },
  { id: 9858, nombre: "CONDOMINIO CONCEPTO DESIGN SAN DAMIAN", ultimoGastoComun: "08-2026", fechaUltimoCierre: "2026-09-23 09:31:45", fechaUltimaLiberacion: null, estadoLiberacion: null, tipoSca: 2 },
  { id: 9748, nombre: "Comunidad Arrayan", ultimoGastoComun: "08-2026", fechaUltimoCierre: "2026-09-15 12:15:49", fechaUltimaLiberacion: "2026-09-15 12:18:59", estadoLiberacion: "notificado", tipoSca: 0 },
  { id: 10761, nombre: "Comunidad Edificio Bellos Horizontes", ultimoGastoComun: "08-2025", fechaUltimoCierre: "2025-09-03 17:44:43", fechaUltimaLiberacion: "2025-09-03 17:49:22", estadoLiberacion: "no_notificado", tipoSca: 1 },
  { id: 9780, nombre: "Comunidad Edificio Galvarino Gallardo", ultimoGastoComun: "09-2026", fechaUltimoCierre: "2026-10-14 12:33:09", fechaUltimaLiberacion: null, estadoLiberacion: null, tipoSca: 0 },
  { id: 10157, nombre: "Comunidad Edificio Valladolid", ultimoGastoComun: "02-2025", fechaUltimoCierre: "2025-03-07 11:28:39", fechaUltimaLiberacion: "2025-03-07 11:31:11", estadoLiberacion: "notificado", tipoSca: 1 },
  { id: 9014, nombre: "Comunidad Notocar xD", ultimoGastoComun: "12-2025", fechaUltimoCierre: "2026-02-13 04:12:20", fechaUltimaLiberacion: "2026-02-13 06:04:13", estadoLiberacion: "notificado", tipoSca: 0 },
  { id: 11846, nombre: "Comunidad Nueva España 1", ultimoGastoComun: "09-2026", fechaUltimoCierre: "2026-10-05 16:43:44", fechaUltimaLiberacion: "2026-10-05 17:00:48", estadoLiberacion: "notificado", tipoSca: 2 },
  { id: 12164, nombre: "Comunidad QA 1", ultimoGastoComun: "02-2026", fechaUltimoCierre: "2026-09-25 10:53:00", fechaUltimaLiberacion: null, estadoLiberacion: null, tipoSca: 0 },
  { id: 9749, nombre: "Condominio Puertas Del Golf Oriente", ultimoGastoComun: "08-2026", fechaUltimoCierre: "2026-09-15 15:53:02", fechaUltimaLiberacion: "2026-09-15 16:05:28", estadoLiberacion: "notificado", tipoSca: 2 },
  { id: 10512, nombre: "Condominio Step Sectores", ultimoGastoComun: "10-2025", fechaUltimoCierre: "2025-11-24 14:48:01", fechaUltimaLiberacion: "2025-11-26 14:21:55", estadoLiberacion: "notificado", tipoSca: 0 },
  { id: 10181, nombre: "DEMO Otrospagos", ultimoGastoComun: "01-2026", fechaUltimoCierre: "2026-08-26 12:01:24", fechaUltimaLiberacion: "2026-08-26 14:26:33", estadoLiberacion: "notificado", tipoSca: 2 },
  { id: 8476, nombre: "Edificio Don Angel", ultimoGastoComun: "08-2026", fechaUltimoCierre: "2026-09-11 13:43:23", fechaUltimaLiberacion: null, estadoLiberacion: null, tipoSca: 2 },
  { id: 10359, nombre: "Edificio ISP", ultimoGastoComun: null, fechaUltimoCierre: null, fechaUltimaLiberacion: null, estadoLiberacion: null, tipoSca: 0 },
  { id: 12128, nombre: "Edificio Nataly Farias", ultimoGastoComun: null, fechaUltimoCierre: null, fechaUltimaLiberacion: null, estadoLiberacion: null, tipoSca: 0 },
  { id: 12127, nombre: "Edificio Rebeca Lobos", ultimoGastoComun: null, fechaUltimoCierre: null, fechaUltimaLiberacion: null, estadoLiberacion: null, tipoSca: 0 },
  { id: 11150, nombre: "Edificio San Pablo", ultimoGastoComun: "03-2026", fechaUltimoCierre: "2026-04-01 16:42:49", fechaUltimaLiberacion: "2026-04-07 18:40:43", estadoLiberacion: "notificado", tipoSca: 0 },
  { id: 8653, nombre: "Edificios Alderete Cook (sectores)", ultimoGastoComun: "08-2026", fechaUltimoCierre: "2026-09-14 09:19:05", fechaUltimaLiberacion: "2026-09-15 18:25:04", estadoLiberacion: "notificado", tipoSca: 2 },
  { id: 10158, nombre: "NMB -Sin sector", ultimoGastoComun: null, fechaUltimoCierre: null, fechaUltimaLiberacion: null, estadoLiberacion: null, tipoSca: 0 },
  { id: 11534, nombre: "OTROSPAGOS V2", ultimoGastoComun: "09-2025", fechaUltimoCierre: "2025-10-01 12:16:33", fechaUltimaLiberacion: "2025-10-01 16:43:03", estadoLiberacion: "notificado", tipoSca: 1 },
  { id: 8512, nombre: "P00020 Comunidad Edificio Torre Alcántara", ultimoGastoComun: "09-2026", fechaUltimoCierre: "2026-09-28 10:14:26", fechaUltimaLiberacion: "2026-10-02 17:07:59", estadoLiberacion: "notificado", tipoSca: 2 },
  { id: 10682, nombre: "P00270 Comunidad Edificio Consorcio Vida", ultimoGastoComun: "08-2026", fechaUltimoCierre: "2026-09-01 11:06:28", fechaUltimaLiberacion: "2026-09-01 18:19:58", estadoLiberacion: "notificado", tipoSca: 2 },
  { id: 11320, nombre: "P00450 Comunidad Edificio Matta 530", ultimoGastoComun: "06-2025", fechaUltimoCierre: "2025-07-18 19:06:10", fechaUltimaLiberacion: "2025-07-25 21:36:49", estadoLiberacion: "no_notificado", tipoSca: 0 },
  { id: 9375, nombre: "P00650 Edificio Neruda", ultimoGastoComun: "10-2025", fechaUltimoCierre: "2025-11-04 11:43:30", fechaUltimaLiberacion: "2025-11-04 11:45:30", estadoLiberacion: "notificado", tipoSca: 0 },
  { id: 9147, nombre: "P01640 Comunidad Edificio de oficinas San Andres Concepcion", ultimoGastoComun: "08-2026", fechaUltimoCierre: "2026-09-04 12:18:16", fechaUltimaLiberacion: "2026-09-07 11:48:00", estadoLiberacion: "notificado", tipoSca: 0 },
  { id: 8756, nombre: "P01650 Paseo Los Heroes de Chillan.", ultimoGastoComun: "12-2025", fechaUltimoCierre: "2026-01-06 11:53:29", fechaUltimaLiberacion: "2026-01-06 11:58:30", estadoLiberacion: "no_notificado", tipoSca: 0 },
  { id: 9146, nombre: "P01750 Edificio Augusto Leguia 100", ultimoGastoComun: "08-2026", fechaUltimoCierre: "2026-08-27 13:37:30", fechaUltimaLiberacion: "2026-09-08 14:58:40", estadoLiberacion: "notificado", tipoSca: 0 },
  { id: 10681, nombre: "Parque Santa Maria - Departamentos (Respaldo)", ultimoGastoComun: "02-2026", fechaUltimoCierre: "2026-03-09 18:15:46", fechaUltimaLiberacion: "2026-03-09 19:30:40", estadoLiberacion: "notificado", tipoSca: 2 },
  { id: 11044, nombre: "Rapelco", ultimoGastoComun: "08-2025", fechaUltimoCierre: "2025-08-04 10:24:21", fechaUltimaLiberacion: "2025-08-04 10:25:01", estadoLiberacion: "no_notificado", tipoSca: 2 },
  { id: 10760, nombre: "SII Integrado - REC - ESPOZ 3300 - BICENTENARIO", ultimoGastoComun: "10-2024", fechaUltimoCierre: "2024-11-11 19:13:26", fechaUltimaLiberacion: "2024-11-11 19:28:51", estadoLiberacion: "notificado", tipoSca: 2 },
  { id: 11043, nombre: "SIS 2 - COMUNIDAD CAMINO LA VILLA", ultimoGastoComun: "03-2025", fechaUltimoCierre: "2025-04-07 13:24:47", fechaUltimaLiberacion: "2025-04-07 13:25:33", estadoLiberacion: "notificado", tipoSca: 1 },
  { id: 10234, nombre: "q", ultimoGastoComun: "08-2026", fechaUltimoCierre: "2026-09-01 11:06:28", fechaUltimaLiberacion: "2026-09-01 18:19:58", estadoLiberacion: "notificado", tipoSca: 2 },
]
