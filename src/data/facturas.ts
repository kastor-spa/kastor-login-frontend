/**
 * Facturas pendientes (Kastor y Caleu). Ver MAPA-facturas-kastor.md y MAPA-facturas-caleu.md.
 * MOCK: en la evidencia legacy (2026-10-14) ambas tablas venían sin filas.
 */
export type EmisorFacturas = 'kastor' | 'caleu'

export interface FacturaPendiente {
  /** folionum del legacy */
  folio: number
  /** docnum del legacy */
  numeroDocumento: number
  /** doctotal (CLP) */
  total: number
  rut: string
  /** cardname */
  comunidad: string
  /** DD-MM-YYYY */
  fechaEmision: string
  /** DD-MM-YYYY */
  fechaVencimiento: string
}

/**
 * Tipos de pago Khipu (value enviado como `type`/`paymentType`).
 * PENDIENTE: el legacy no renderizó las opciones reales del select; estas son de demo.
 */
export const tiposPagoKhipu = [
  { value: 'simplified_transfer', label: 'Transferencia simplificada' },
  { value: 'regular_transfer', label: 'Transferencia normal' },
  { value: 'card', label: 'Tarjeta de crédito o débito' },
]

/** Comisión simulada por tipo de pago (mock del POST /api/v1/fee). */
export const comisionMock: Record<string, number> = {
  simplified_transfer: 0.008,
  regular_transfer: 0.01,
  card: 0.029,
}

export const datosBancariosKastor = [
  { label: 'Razón social', value: 'KASTOR SPA' },
  { label: 'Banco', value: 'BANCO BCI' },
  { label: 'Nº Cta Cte', value: '10678280' },
  { label: 'RUT', value: '76.722.143-6' },
  { label: 'Correo', value: 'pagos@kastor.cl' },
]

export const facturasKastor: FacturaPendiente[] = [
  { folio: 31201, numeroDocumento: 31201, total: 119000, rut: '77.834.007-0', comunidad: 'Administradora Acodef Ltda', fechaEmision: '01-09-2026', fechaVencimiento: '30-09-2026' },
  { folio: 31202, numeroDocumento: 31202, total: 119000, rut: '77.834.007-0', comunidad: 'Administradora Acodef Ltda', fechaEmision: '01-10-2026', fechaVencimiento: '31-10-2026' },
  { folio: 31244, numeroDocumento: 31244, total: 238000, rut: '56.068.230-1', comunidad: 'COMUNIDAD CAMINO LA VILLA', fechaEmision: '01-10-2026', fechaVencimiento: '31-10-2026' },
  { folio: 31260, numeroDocumento: 31260, total: 89250, rut: '65.112.233-4', comunidad: 'Comunidad Nueva España 1', fechaEmision: '01-10-2026', fechaVencimiento: '31-10-2026' },
  { folio: 31275, numeroDocumento: 31275, total: 1250000, rut: '76.554.433-8', comunidad: 'Edificios Alderete Cook (sectores)', fechaEmision: '15-08-2026', fechaVencimiento: '14-09-2026' },
]

export const facturasCaleu: FacturaPendiente[] = [
  { folio: 50121, numeroDocumento: 50121, total: 89000, rut: '65.123.456-7', comunidad: 'Comunidad Arrayan', fechaEmision: '05-09-2026', fechaVencimiento: '05-10-2026' },
  { folio: 50122, numeroDocumento: 50122, total: 145500, rut: '65.123.456-7', comunidad: 'Comunidad Arrayan', fechaEmision: '05-10-2026', fechaVencimiento: '04-11-2026' },
  { folio: 50140, numeroDocumento: 50140, total: 1250000, rut: '53.987.654-3', comunidad: 'Condominio Puertas Del Golf Oriente', fechaEmision: '20-09-2026', fechaVencimiento: '20-10-2026' },
  { folio: 50157, numeroDocumento: 50157, total: 32990, rut: '56.444.222-K', comunidad: 'Edificio San Pablo', fechaEmision: '01-10-2026', fechaVencimiento: '31-10-2026' },
]

/** Deuda total por comunidad (columna "Deuda" de Kastor). */
export function deudaPorComunidad(facturas: FacturaPendiente[]): Record<string, number> {
  return facturas.reduce<Record<string, number>>((acc, f) => {
    acc[f.comunidad] = (acc[f.comunidad] ?? 0) + f.total
    return acc
  }, {})
}
