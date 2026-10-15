import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeftRight,
  Blocks,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Coins,
  CreditCard,
  FileText,
  HandCoins,
  History,
  House,
  Landmark,
  Mail,
  Receipt,
  Settings,
  ShieldCheck,
  Undo2,
  Users,
  Wallet,
} from 'lucide-react'

/**
 * Origen de cada módulo:
 * - 'captura': visto en capturas del sistema legacy (navegación admin).
 * - 'css': inferido desde clases de main2.css. Los inferidos sin pantalla real se descartaron
 *   el 2026-10-14 (ver docs/mapas/MODULOS.md).
 * Cuando un módulo se mapea (docs/mapas/MAPA-<slug>.md) pasa a status 'mapeado'.
 */
export type ModuleSource = 'captura' | 'css'
export type ModuleStatus = 'confirmado' | 'inferido' | 'mapeado'

export interface NavModule {
  slug: string
  title: string
  to: string
  icon: LucideIcon
  source: ModuleSource
  status: ModuleStatus
  /** Contador opcional (pendientes, cantidad). */
  badge?: string
  /** Clases legacy que respaldan el módulo (para trazabilidad). */
  legacyHints?: string[]
}

export interface NavCategory {
  label: string
  modules: NavModule[]
}

export const navigation: NavCategory[] = [
  {
    label: 'Administración',
    modules: [
      { slug: 'comunidades', title: 'Comunidades', to: '/', icon: Building2, source: 'captura', status: 'mapeado', badge: '12', legacyHints: ['.titulo-comunidad', '.community-select'] },
      { slug: 'usuarios', title: 'Usuarios', to: '/usuarios', icon: Users, source: 'captura', status: 'confirmado' },
      { slug: 'perfiles', title: 'Perfiles', to: '/perfiles', icon: ShieldCheck, source: 'captura', status: 'mapeado', legacyHints: ['/login/perfiles', '/login/perfiles/agregar', '/login/perfiles/modificar/:id'] },
      { slug: 'tareas', title: 'Tareas', to: '/tareas', icon: ClipboardList, source: 'captura', status: 'mapeado', badge: '3', legacyHints: ['/login/tareas', '/login/tareas/agregar'] },
    ],
  },
  {
    label: 'Cobranza',
    modules: [
      { slug: 'sistema-cobranza', title: 'Sistema Cobranza', to: '/cobranza', icon: Landmark, source: 'captura', status: 'mapeado', legacyHints: ['/login/dashboard/sca', '.change_com', '/login/dashboard/cambiar_sca'] },
      { slug: 'uf', title: 'UF', to: '/uf', icon: Coins, source: 'captura', status: 'mapeado', legacyHints: ['/login/dashboard/configuracion_uf'] },
    ],
  },
  {
    label: 'Facturación',
    modules: [
      { slug: 'facturas-kastor', title: 'Facturas Kastor pendientes', to: '/facturas/kastor', icon: Receipt, source: 'captura', status: 'mapeado', legacyHints: ['/login/dashboard/facturas', '/login/dashboard/solicitar_pac', 'Khipu'] },
      { slug: 'facturas-caleu', title: 'Facturas Caleu pendientes', to: '/facturas/caleu', icon: FileText, source: 'captura', status: 'mapeado', legacyHints: ['/login/dashboard/facturas_caleu3', 'Khipu'] },
    ],
  },
]

export const supportPhones = ['02-2 833 8269', '02-2 833 8307']

/** Patrones de UI del legacy detectados en main2.css, para reutilizar al mapear módulos. */
export const legacyUiPatterns = [
  'Navbar con selector de comunidad (.community-select) y notificaciones (.nav-icon-notification)',
  'Home de módulos en tiles (.box-modulo 139x145, hover azul oscuro #364155)',
  'Listados con DataTables: filtro, largo de página, sub-tablas, celdas responsivas',
  'Breadcrumbs y botón Volver',
  'Alertas info / success / warning / danger y alerta de mantenimiento',
  'Modales js-confirm y modales Bootstrap',
  'Switches on/off (tamaño normal y grande)',
  'Botones: activo naranja #EF7D00, inactivo #E6AA76, secundarios de tabla, "agregar +"',
  'Lista desplegable con filtro (bootstrap-select)',
  'Logos de administraciones y comunidades',
  'Avatar Kastorsito (asistente)',
  'Pie de página',
]

/* ------------------------------------------------------------------
 * Kastor Contable: navegación dentro de una comunidad (/comunidades/:id).
 * Sidebar de 2 niveles: nivel 1 = productos (src/config/productos.ts),
 * nivel 2 = este menú. Fuente: listado entregado por Héctor el 2026-10-15.
 * El prefijo "DEV" del legacy se omitió en los títulos de categoría.
 * ------------------------------------------------------------------ */

export interface ContableModulo {
  slug: string
  title: string
}

export interface ContableCategoria {
  slug: string
  title: string
  icon: LucideIcon
  /** Módulos operativos de la categoría. Vacío = ítem directo (sin dropdown). */
  modulos: ContableModulo[]
  /** Módulos listados bajo el separador "INFORMES:". */
  informes?: ContableModulo[]
}

const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const mods = (...titles: string[]): ContableModulo[] => titles.map((title) => ({ slug: slugify(title), title }))

const categoria = (title: string, icon: LucideIcon, modulos: string[] = [], informes?: string[]): ContableCategoria => ({
  slug: slugify(title),
  title,
  icon,
  modulos: mods(...modulos),
  informes: informes ? mods(...informes) : undefined,
})

export const navigationContable: ContableCategoria[] = [
  categoria('Inicio', House),
  categoria('Crear Unidades', Blocks, ['Elementos', 'Unidades', 'Listado de Unidades', 'Carga de comunidad', 'Sectores']),
  categoria('Configuración', Settings, ['Datos Comunidad', 'Sistema de Cobranza', 'Proveedores', 'Categorías', 'Subcategorías', 'Categorías de Recargo']),
  categoria(
    'Gastos Comunidad',
    Wallet,
    ['Seguros CCS', 'Ver Gastos', 'Ingresar Gastos', 'Asignar Gastos', 'Pagar Gastos', 'Medidores', 'Libro de compras SII'],
    ['Egresos 2', 'Egresos', 'Presupuesto (Detalle Gastos)'],
  ),
  categoria('Pagos G. C.', CreditCard, ['Pagos Unidad', 'Recargos Unidad', 'Reversa de Pagos'], ['Ingresos', 'Informe de Pagos']),
  categoria(
    'Remuneraciones',
    BriefcaseBusiness,
    ['Trabajadores', 'Remuneraciones', 'Asignación Familiar'],
    [
      'Libro de Remuneraciones',
      'Recibo de Liquidaciones',
      'Detalle Leyes Sociales',
      'Reporte de liquidaciones',
      'Detalle de Remuneraciones',
      'Nómina de pago trabajadores',
      'Archivos LRE',
      'Archivos Previred',
      'Recibo de Anticipos',
      'Consolidación de Sueldos',
      'Declaración Jurada de Rentas',
      'Abrir Remuneraciones',
      'Impresión Hojas Foliadas',
    ],
  ),
  categoria(
    'Banco',
    Landmark,
    ['Provisión Transbank', 'Cuentas Bancarias', 'Chequeras', 'Ingreso a Cuenta', 'Conciliación Bancaria', 'Fondos', 'Rendimiento de fondos'],
    ['Flujo de caja', 'Libro Banco', 'Estado de Resultado', 'Estado Financiero', 'Cartera de Cheques', 'Cartola Caja Chica'],
  ),
  categoria(
    'Cobranza G.C.',
    HandCoins,
    ['Liberar Gasto Común', 'No Prorrateables', 'Minutas', 'Cartola por Unidad'],
    [
      'Asistencia Asamblea',
      'Cobranza de Gastos Comunes',
      'Aviso de cobro (Boleta)',
      'Aviso suspensión de servicios',
      'Elementos por Unidad',
      'Planilla General de Cobranza',
      'Prorrateo por elementos',
      'Detalle Interés multa',
      'Reporte de Morosos',
    ],
  ),
  // PENDIENTE DE CONFIRMAR: en el listado vienen después de los informes de Cobranza G.C.;
  // se tratan como ítems directos del menú.
  categoria('Mailing', Mail),
  categoria('Movimientos Unidad', ArrowLeftRight),
  categoria('Log Usuarios', History),
  categoria('Desprorratear', Undo2),
]

/** Ruta interna de un módulo de Kastor Contable dentro de la comunidad. */
export function rutaContable(comunidadId: string, categoria?: ContableCategoria, modulo?: ContableModulo) {
  const base = `/comunidades/${comunidadId}`
  if (!categoria || categoria.slug === 'inicio') return base
  return modulo ? `${base}/${categoria.slug}/${modulo.slug}` : `${base}/${categoria.slug}`
}
