import type { LucideIcon } from 'lucide-react'
import { Calculator, Globe, LayoutGrid, Workflow } from 'lucide-react'

/**
 * Productos que ofrece la pantalla de bienvenida (ruteador post-login).
 * - `ruta`: ruta interna de este frontend.
 * - `url`: plataforma externa (se abre en la misma pestaña).
 * Si ambos son null, el producto aparece como "Próximamente".
 */
export interface Producto {
  slug: string
  nombre: string
  descripcion: string
  icon: LucideIcon
  /** Clases de acento del icono (tokens de marca). */
  acento: string
  ruta: string | null
  url: string | null
}

export const productos: Producto[] = [
  {
    slug: 'contable',
    nombre: 'Kastor Contable',
    descripcion: 'Gastos comunes, cobranza, remuneraciones y facturación de tus comunidades.',
    icon: Calculator,
    acento: 'bg-brand-orange/10 text-brand-orange',
    ruta: '/',
    url: null,
  },
  {
    slug: 'operaciones',
    nombre: 'Kastor Operaciones',
    descripcion: 'Mantenciones, tareas del personal, proveedores y bitácora del día a día.',
    icon: Workflow,
    acento: 'bg-brand-purple/10 text-brand-purple',
    ruta: null,
    url: null, // PENDIENTE: URL de la plataforma
  },
  {
    slug: 'comunidad-en-linea',
    nombre: 'Tu comunidad en línea',
    descripcion: 'Portal de residentes: comunicados, reservas, votaciones y pagos en línea.',
    icon: Globe,
    acento: 'bg-info/10 text-info',
    ruta: null,
    url: null, // PENDIENTE: URL de la plataforma
  },
  {
    slug: 'otro',
    nombre: 'Kastor Otro',
    descripcion: 'Espacio reservado para un nuevo producto de la suite Kastor.',
    icon: LayoutGrid,
    acento: 'bg-success/10 text-success',
    ruta: null,
    url: null, // PENDIENTE: definir producto
  },
]
