/**
 * Catálogo de permisos (submódulos) del legacy, extraído de /login/perfiles/agregar y
 * /login/perfiles/modificar/2326 (docs/referencias/perfiles/02 y 03). 9 grupos, 89 permisos.
 * El orden es el del legacy y no es correlativo: respetarlo.
 */
export interface Permiso {
  /** value del checkbox submodulos[] */
  id: number
  label: string
  /** Filas "INFORMES": permiso real que además actúa como separador visual. */
  informe?: true
}

export interface PermisoGrupo {
  id: number
  /** Nombre exacto en el legacy (con prefijo "DEV" y espacios dobles). */
  nombreLegacy: string
  /** Nombre para mostrar, sin prefijo "DEV". */
  nombre: string
  permisos: Permiso[]
}

export const gruposPermisos: PermisoGrupo[] = [
  {
    id: 1,
    nombreLegacy: "DEV Crear Unidades",
    nombre: "Crear Unidades",
    permisos: [
      { id: 1, label: "Elementos" },
      { id: 3, label: "Unidades" },
      { id: 109, label: "Listado de Unidades" },
      { id: 107, label: "Carga de comunidad" },
      { id: 217, label: "Sectores" },
    ],
  },
  {
    id: 2,
    nombreLegacy: "DEV Configuracion",
    nombre: "Configuracion",
    permisos: [
      { id: 4, label: "Datos Comunidad" },
      { id: 69, label: "Sistema de Cobranza" },
      { id: 7, label: "Proveedores" },
      { id: 8, label: "Categorias" },
      { id: 9, label: "Subcategorias" },
      { id: 10, label: "Categorias de Recargo" },
    ],
  },
  {
    id: 3,
    nombreLegacy: "DEV Gastos Comunidad",
    nombre: "Gastos Comunidad",
    permisos: [
      { id: 1010, label: "Ordenes de Compra" },
      { id: 220, label: "Seguros CCS" },
      { id: 12, label: "Ver Gastos" },
      { id: 13, label: "Ingresar Gastos" },
      { id: 14, label: "Asignar Gastos" },
      { id: 87, label: "Codigos de Cuenta" },
      { id: 15, label: "Pagar Gastos" },
      { id: 17, label: "Medidores" },
      { id: 231, label: "Libro de compras SII" },
      { id: 11, label: "INFORMES", informe: true },
      { id: 84, label: "Egresos 2" },
      { id: 1011, label: "Cartola Proveedores" },
      { id: 16, label: "Egresos" },
      { id: 54, label: "Detalle Gastos" },
    ],
  },
  {
    id: 4,
    nombreLegacy: "DEV Pagos G. C.",
    nombre: "Pagos G. C.",
    permisos: [
      { id: 18, label: "Pagos Unidad" },
      { id: 19, label: "Recargos Unidad" },
      { id: 20, label: "Reversa de Pagos" },
      { id: 59, label: "INFORMES", informe: true },
      { id: 49, label: "Ingresos" },
      { id: 68, label: "Informe de Pagos" },
    ],
  },
  {
    id: 5,
    nombreLegacy: "DEV  Remuneraciones",
    nombre: "Remuneraciones",
    permisos: [
      { id: 21, label: "Trabajadores" },
      { id: 22, label: "Remuneraciones" },
      { id: 26, label: "Asignacion Familiar" },
      { id: 60, label: "INFORMES", informe: true },
      { id: 44, label: "Libro de Remuneraciones" },
      { id: 45, label: "Recibo de Liquidaciones" },
      { id: 90, label: "Detalle Leyes Sociales" },
      { id: 202, label: "Reporte de liquidaciones" },
      { id: 56, label: "Detalle de Remuneraciones" },
      { id: 47, label: "Archivos Previred" },
      { id: 201, label: "Nomina de pago trabajadores" },
      { id: 203, label: "Archivos LRE" },
      { id: 46, label: "Recibo de Anticipos" },
      { id: 111, label: "Consolidacion de Sueldos" },
      { id: 108, label: "Declaracion Jurada de Rentas" },
      { id: 73, label: "Abrir Remuneraciones" },
      { id: 81, label: "Impresion Hojas Foliadas" },
    ],
  },
  {
    id: 6,
    nombreLegacy: "DEV  Banco",
    nombre: "Banco",
    permisos: [
      { id: 79, label: "Provision Transbank" },
      { id: 30, label: "Cuentas Bancarias" },
      { id: 31, label: "Chequeras" },
      { id: 29, label: "Ingreso a Cuenta" },
      { id: 76, label: "Conciliacion Bancaria" },
      { id: 50, label: "Fondos" },
      { id: 222, label: "Rendimiento de fondos" },
      { id: 61, label: "INFORMES", informe: true },
      { id: 230, label: "Flujo de caja" },
      { id: 85, label: "Libro Banco" },
      { id: 221, label: "Estado de Resultado" },
      { id: 78, label: "Estado Financiero" },
      { id: 51, label: "Cartera de Cheques" },
      { id: 28, label: "Cartola Caja Chica" },
    ],
  },
  {
    id: 7,
    nombreLegacy: "DEV Cobranza G.C.",
    nombre: "Cobranza G.C.",
    permisos: [
      { id: 80, label: "Liberar Gasto Comun" },
      { id: 89, label: "No Prorrateables" },
      { id: 33, label: "Minutas" },
      { id: 35, label: "Cartola por Unidad" },
      { id: 62, label: "INFORMES", informe: true },
      { id: 91, label: "Asistencia Asamblea" },
      { id: 34, label: "Cobranza de Gastos Comunes" },
      { id: 37, label: "Aviso de cobro (Boletas)" },
      { id: 38, label: "Aviso suspension de servicios" },
      { id: 42, label: "Elementos por Unidad" },
      { id: 43, label: "Planilla General de Cobranza" },
      { id: 104, label: "Prorrateo por elementos" },
      { id: 110, label: "Detalle Interes multa" },
      { id: 55, label: "Reporte de Morosos" },
      { id: 88, label: "Mailing" },
      { id: 67, label: "Movimientos Unidad" },
      { id: 75, label: "Log Usuarios" },
      { id: 74, label: "Desprorratear" },
    ],
  },
  {
    id: 10,
    nombreLegacy: "DEV Historico",
    nombre: "Historico",
    permisos: [
      { id: 211, label: "Ver gastos" },
    ],
  },
  {
    id: 11,
    nombreLegacy: "DEV TCEL",
    nombre: "TCEL",
    permisos: [
      { id: 1001, label: "Usuarios / Unidades" },
      { id: 1002, label: "Biblioteca" },
      { id: 1003, label: "Solicitudes / Novedades" },
      { id: 1004, label: "Reservas / Instalaciones" },
      { id: 1005, label: "Comunicados" },
      { id: 1006, label: "Citaciones" },
      { id: 1007, label: "Votaciones" },
      { id: 1008, label: "Configuración" },
    ],
  },
]

export const totalPermisos = gruposPermisos.reduce((n, g) => n + g.permisos.length, 0)
